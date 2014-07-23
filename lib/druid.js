'use strict'

var Client = require('./client')
  , debug = require('debug')('druid-query:druid')
  , DruidError = require('./errors').DruidError
  , EventEmitter = require('events').EventEmitter
  , lodash = require('lodash')
  , request = require('request')
  , util = require('util')
  , utils = require('./utils')
  , zookeeper = require('node-zookeeper-client')
  , queries = utils.moduleMap(__dirname + '/queries')


module.exports = Druid




/**
 * Works like async.map
 *
 * @param array
 * @param iterator
 * @param done
 */
function asyncMap(array, iterator, done) {
  if (!array || !array.length) {
    return done(null, [])
  }

  var error
    , out = []
    , todo = array.length

  array.forEach(exec)

  function exec(item) {
    process.nextTick(function tick() {
      iterator(item, add)
    })
  }

  function add(err, data) {
    if (error) {
      return
    }
    else if (err) {
      error = true
      return done(err)
    }

    out.push(data)

    if (--todo === 0) {
      done(null, out)
    }
  }
}




function getDataSources(nodeInfo, callback) {
  var url = nodeInfo.url + '/druid/v2/datasources'

  request({
    url:  url,
    json: true
  }, onresponse)

  function onresponse(err, res, data) {
    if (err) {
      callback(err)
    }
    else if (res.statusCode !== 200) {
      callback(new DruidError('Unknown error while accessing ' + url))
    }
    else {
      nodeInfo.datasources = data

      debug('Data sources for Druid node ' + nodeInfo.id + ': ' + data)

      callback(null, nodeInfo)
    }
  }
}




/**
 * Bad-ass load-balancing
 *
 * @param {Druid} client Client instance
 * @param {string} dataSource Data source name
 * @returns {DruidNode}
 */
function getLessLoaded(client, dataSource) {
  var ids = client.dataSources[dataSource]
    , nodes
    , node

  nodes = ids.map(id2client)

  function id2client(id) {
    return client.nodes[id]
  }

  node = nodes.reduce(lessLoaded)

  function lessLoaded(nodeA, nodeB) {
    if (nodeA.queries < nodeB.queries) {
      return nodeA
    }
    else {
      return nodeB
    }
  }

  return node
}




/**
 * Get Druid node data from ZooKeeper and list of data sources
 *
 * @private
 * @param {Druid} client Client instance
 * @param {string} id Druid Node ID
 * @param {function} callback Accepts arguments: (err, nodeData)
 */
function getNodeData(client, id, callback) {
  var path = client.discoveryPath + '/' + id
    , preferSSL = client.options.preferSSL

  client.zk.getData(path, handleData)

  function handleData(err, jsonBuffer) {
    if (err) {
      return callback(new DruidError('Error getting node data', err))
    }

    debug('ZooKeeper data for path ' + path + ': ' + jsonBuffer)

    var data
      , proto
      , port

    try {
      data = JSON.parse(jsonBuffer.toString('utf8'))
    }
    catch (ex) {
      return callback(ex)
    }

    if (preferSSL && data.sslPort) {
      proto = 'https'
      port = data.sslPort
    }
    else {
      proto = 'http'
      port = data.port
    }

    data.path = path
    data.url = util.format('%s://%s:%s', proto, data.address, port)

    getDataSources(data, callback)
  }
}




/**
 * Get Query object for given data source
 *
 * @param {Druid} client Client instance
 * @param {function} queryClass Query class
 * @param {string} dataSource Data source name
 * @param {object} [rawQuery] Raw query data
 * @returns {Query|null} Null if client is not ready ({@link Druid#ready})
 */
function getQuery(client, queryClass, dataSource, rawQuery) {
  if (!client.ready) {
    return null
  }
  else if (!dataSource) {
    throw new DruidError('Data source is not specified')
  }
  else if (!client.dataSources.hasOwnProperty(dataSource)) {
    return null
  }

  var node = getLessLoaded(client, dataSource)

  return new queryClass(node, rawQuery).dataSource(dataSource)
}




/**
 * Initiate ZooKeeper client
 *
 * @param {Druid} client
 * @param {string} connectionString ZooKeeper connection string
 */
function initZookeeper(client, connectionString) {
  var zk = zookeeper.createClient(connectionString, client.options)

  client.ready = false
  client.zk = zk

  zk.connect()
  zk.on('connected', init)
  zk.on('disconnected', reconnect)
  zk.on('expired', reconnect)
  zk.on('error', onerror)

  function init() {
    debug('Getting info about nodes and data sources')

    client.init()
  }

  function reconnect() {
    if (!client.closed) {
      debug('Reconnecting to ' + connectionString)

      initZookeeper(client, connectionString)
    }
  }

  function onerror(err) {
    client.emit('error', err)
  }
}




/**
 * Druid client wrapper
 *
 * @constructor
 * @extends Client
 * @param {object} data Node data from ZooKeeper
 */
function DruidNode(data) {
  Client.call(this, data.url)


  /**
   * Node data from ZooKeeper
   *
   * @public
   * @type {object}
   */
  this.data = data


  /**
   * Number of queries currently running
   *
   * @public
   * @type {number}
   */
  this.queries = 0
}
util.inherits(DruidNode, Client)




/**
 * Wrap {@link Client#exec} to count number of concurrent running queries
 *
 * @public
 * @see {@link Client#exec}
 * @param {Query} query Query wrapper
 * @param {function} callback Accepts arguments: (err, data)
 */
DruidNode.prototype.exec = function(query, callback) {
  var self = this
  this.queries++

  debug('Concurrent queries to Druid node ' + this.data.id + ': ' + this.queries)

  Client.prototype.exec.call(this, query, wrapper)

  function wrapper() {
    self.queries--

    callback.apply(null, arguments)
  }
}




/**
 * Druid client relying on ZooKeeper nodes data
 *
 * @constructor
 * @extends EventEmitter
 * @param {string} connectionString ZooKeeper connection string
 * @param {string} discoveryPath Nodes discovery path
 * @param {object} [options] node-zookeeper-client options
 * @param {boolean} [options.preferSSL] Prefer SSL connection to Druid nodes if available
 */
function Druid(connectionString, discoveryPath, options) {
  EventEmitter.call(this)
  this.setMaxListeners(0)

  if (arguments.length === 2) {
    options = {}
  }


  /**
   * Services discovery path
   *
   * @protected
   * @type {string}
   */
  this.discoveryPath = discoveryPath


  /**
   * Client options
   *
   * @protected
   */
  this.options = options


  /**
   * Finished getting info about nodes and datasources
   *
   * @protected
   * @type {boolean}
   */
  this.ready = false


  /**
   * Nodes (id -> node)
   *
   * @protected
   */
  this.nodes = {}


  /**
   * Nodes associated with each data source (dataSource -> [nodeA, nodeB, ..., nodeN])
   *
   * @protected
   */
  this.dataSources = {}


  /**
   * ZooKeeper client
   *
   * @protected
   */
  initZookeeper(this, connectionString)
}
util.inherits(Druid, EventEmitter)




// Expose all queries types
lodash.each(queries, function(queryClass, type) {
  Druid.prototype[type] = function(dataSource, rawQuery) {
    return getQuery(this, queryClass, dataSource, rawQuery)
  }
})




/**
 * Finish working with client
 *
 * @public
 */
Druid.prototype.end = function() {
  this.closed = true
  this.zk.close()
}




/**
 * Return list of data sources
 *
 * @public
 * @returns {string[]}
 */
Druid.prototype.getDataSources = function() {
  return Object.keys(this.dataSources)
}




/**
 * Return list of nodes
 *
 * @public
 * @returns {DruidNode[]}
 */
Druid.prototype.getNodes = function() {
  return lodash.values(this.nodes)
}




/**
 * Initialize client
 *
 * @protected
 * @see {@link Druid#reloadList}
 */
Druid.prototype.init = function() {
  var self = this

  this.reloadList(done)

  function done(err) {
    if (err) {
      self.emit('error', err)
    }
    else if (!self.ready) {
      self.ready = true
      self.emit('ready')
    }
  }
}




/**
 * Get list of nodes and data sources they serve
 *
 * @private
 * @param {function} callback Accepts arguments: (err)
 */
Druid.prototype.reloadList = function(callback) {
  var self = this

  if (!this.ready) {
    this.zk.getChildren(this.discoveryPath, update, getDataSources)
  }
  else {
    this.zk.getChildren(this.discoveryPath, getDataSources)
  }

  function update() {
    self.init()
  }

  function getDataSources(err, children) {
    if (err) {
      return callback(new DruidError('Error getting info about Druid nodes', err))
    }

    asyncMap(children, getData, done)
  }

  function getData(id, callback) {
    getNodeData(self, id, callback)
  }

  function done(err, data) {
    if (err) {
      return callback(err)
    }

    var dataSources = {}
      , nodes = {}
      , nodeData
      , i
      , ds

    while (nodeData = data.shift()) {
      nodes[nodeData.id] = new DruidNode(nodeData)

      i = 0
      while (ds = nodeData.datasources[i++]) {
        if (dataSources.hasOwnProperty(ds)) {
          dataSources[ds].push(nodeData.id)
        }
        else {
          dataSources[ds] = [nodeData.id]
        }
      }
    }

    self.nodes = nodes
    self.dataSources = dataSources

    callback(null)
  }
}
