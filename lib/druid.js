'use strict'

var Client = require('./client')
  , debug = require('debug')('druid-query:druid')
  , DruidError = require('./errors').DruidError
  , EventEmitter = require('events').EventEmitter
  , each = require('lodash.foreach')
  , values = require('lodash.values')
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
    if (nodeA.active < nodeB.active) {
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
 * Initiate ZooKeeper client
 *
 * @param {Druid} client
 * @param {string} connectionString ZooKeeper connection string
 */
function initZookeeper(client, connectionString) {
  var zk = zookeeper.createClient(connectionString, client.options.zookeeper)
  var error = false
  var connected = false

  client.ready = false
  client.zk = zk

  zk.connect()
  zk.on('connected', onconnected)
  zk.on('expired', setError)
  zk.on('authenticationFailed', setError)
  zk.on('disconnected', ondisconnected)
  zk.on('error', onerror)

  function onconnected() {
    if (!connected) {
      connected = true;

      client.updateBrokerList()
    }

    error = false;
  }

  function setError() {
    error = true;
  }

  function ondisconnected() {
    if (client.closed) {
      return
    }

    debug('Lost connection with ZooKeeper. Reconnecting...');

    if (error) {
      zk.removeListener('error', onerror)
      zk.removeListener('disconnected', ondisconnected)
      zk.removeListener('expired', setError)
      zk.removeListener('authenticationFailed', setError)
      zk.close()

      initZookeeper(client, connectionString);
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
   * Number of active HTTP calls currently running
   *
   * @public
   * @type {number}
   */
  this.active = 0
}
util.inherits(DruidNode, Client)




/**
 * Wrap {@link Client} methods to count number of concurrent running queries
 */
function wrapCountingMethod(method) {
  DruidNode.prototype[method] = function() {
    var self = this
      , args = utils.args(arguments, 0)
      , callback = args.pop()

    self.active++

    debug('Active calls to Druid node ' + this.data.id + ': ' + this.active)

    function wrapper() {
      self.active--

      callback.apply(null, arguments)
    }

    args.push(wrapper)

    Client.prototype[method].apply(this, args)
  }
}
wrapCountingMethod('cancel')
wrapCountingMethod('exec')




/**
 * Druid client relying on ZooKeeper nodes data
 *
 * @constructor
 * @extends EventEmitter
 * @param {string} connectionString ZooKeeper connection string
 * @param {string} discoveryPath Nodes discovery path
 * @param {object} [options] node-zookeeper-client options
 * @param {boolean} [options.preferSSL] Prefer SSL connection to Druid nodes if available
 * @param {boolean} [options.zookeeper] node-zookeeper-client createClient() options
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
   * (Re)loaded info about nodes and datasources
   *
   * @public
   * @type {boolean}
   */
  this.ready;


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
each(queries, function(queryClass, type) {
  Druid.prototype[type] = function(dataSource, rawQuery) {
    if (!dataSource) {
      throw new DruidError('Data source is not specified')
    }

    return new queryClass(this, rawQuery).dataSource(dataSource)
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
  return values(this.nodes)
}




/**
 * Initialize client
 *
 * @protected
 * @see {@link Druid#reloadList}
 */
Druid.prototype.updateBrokerList = function() {
  var self = this

  debug('Getting info about brokers and data sources')

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

  // Make Druid#exec() wait for new data
  this.ready = false

  this.zk.getChildren(this.discoveryPath, update, getDataSources)

  function update(event) {
    debug('Got event ' + event.name + '. Updating nodes data...')

    self.updateBrokerList()
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




/**
 * Create method which has same-named method in {@link Client}. Wrapper does:
 *
 * 1. Checks if Druid instance is ready.
 * 2. Gets suitable node (using given query).
 * 3. Passes query & callback to this method
 */
function wrapQueryMethod(method) {
  Druid.prototype[method] = function(query, callback) {
    if (!this.ready) {
      var self = this
        , onready
        , onerror

      onready = function() {
        self.removeListener('error', onerror)
        self[method](query, callback)
      }

      onerror = function(err) {
        self.removeListener('ready', onready)
        callback(err)
      }

      this.once('ready', onready)
      this.once('error', onerror)

      return
    }

    var ds = query.dataSource()

    if (!this.dataSources.hasOwnProperty(ds)) {
      callback(new DruidError('No node serves data source: ' + ds))
    }
    else {
      var node = getLessLoaded(this, ds)

      node[method](query, callback)
    }
  }
}
wrapQueryMethod('cancel')
wrapQueryMethod('exec')
