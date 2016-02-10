'use strict'

var DruidError = require('./errors').DruidError
  , each = require('lodash.foreach')
  , request = require('request')
  , util = require('util')
  , utils = require('./utils')
  , zookeeper = require('node-zookeeper-client')
  , queries = utils.moduleMap(__dirname + '/queries')


module.exports = Client




// Expose all queries types
each(queries, function(queryClass, type) {
  Client.prototype[type] = function(rawQuery) {
    return new queryClass(this, rawQuery)
  }
})




/**
 * Druid querying client
 *
 * @constructor
 * @param {string} url
 */
function Client(url) {
  if (!url) {
    throw new Error('Druid node URL should be specified')
  }


  /**
   * Base Druid node URL
   */
  this.url = url
}




/**
 * Get URL from random node from ZooKeeper and create client instance for it
 *
 * @static
 * @public
 * @param {string} connectionString ZooKeeper connection string
 * @param {string} discoveryPath Service discovery path
 * @param {object} [options] lookup options
 * @param {boolean} [options.preferSSL=false] Use SSL port instead of HTTP if available
 * @param {function} callback Accepts arguments: (err, client)
 */
Client.fromZooKeeper = function(connectionString, discoveryPath, options, callback) {
  if (arguments.length === 3) {
    callback = options
    options = {}
  }

  var zk = zookeeper.createClient(connectionString)

  zk.connect()
  zk.once('connected', onconnected)
  zk.once('error', error)

  function onconnected(err) {
    if (err) {
      return error(err)
    }

    zk.getChildren(discoveryPath, chooseNode)
  }

  function random(list) {
    return list[Math.floor(Math.random()*list.length)]
  }

  function chooseNode(err, children) {
    if (err) {
      return error(err)
    }

    var id = random(children)
      , nodePath = discoveryPath + '/' + id

    zk.getData(nodePath, createClient)
  }

  function createClient(err, jsonBuffer) {
    if (err) {
      return error(err)
    }

    var data
      , url
      , proto
      , port

    try {
      data = JSON.parse(jsonBuffer.toString('utf8'))
    } catch (ex) {
      return error(ex)
    }

    if (options.preferSSL && data.sslPort) {
      proto = 'https'
      port = data.sslPort
    }
    else {
      proto = 'http'
      port = data.port
    }

    url = util.format('%s://%s:%s', proto, data.address, port)

    zk.close()
    callback(null, new Client(url))
  }

  function error(err) {
    zk.close()
    callback(err)
  }
}




/**
 * Cancel query execution
 *
 * @public
 * @param {Query} query Query object
 * @param {function} callback Accepts arguments: (err)
 */
Client.prototype.cancel = function(query, callback) {
  var ctx = query.context()

  if (!ctx || !ctx.queryId) {
    return callback(new DruidError('"queryId" is not specified in query context.'))
  }

  request({
    url:    this.url + '/druid/v2/' + ctx.queryId,
    method: 'DELETE',
    json:   true
  }, onresponse)

  function onresponse(err, response, data) {
    if (err) {
      callback(err)
    }
    else if (response.statusCode === 404) {
      callback(new DruidError('No active query with ID "%s"', ctx.queryId))
    }
    else if (response.statusCode !== 200) {
      callback(new DruidError('Unknown error (status: %d) while cancelling query: %j', response.statusCode, data))
    }
    else {
      callback(null)
    }
  }
}




/**
 * Get list of available dataSources
 *
 * @public
 * @param {function} callback Accepts arguments: (err, dataSources)
 */
Client.prototype.dataSources = function(callback) {
  request({
    url:    this.url + '/druid/v2/datasources',
    method: 'GET',
    json:   true
  }, onresponse)

  function onresponse(err, response, dataSources) {
    if (err) {
      callback(err)
    }
    else {
      callback(null, dataSources)
    }
  }
}




/**
 * Execute query
 *
 * @public
 * @param {Query} query Query object
 * @param {function} callback Accepts arguments: (err, data)
 */
Client.prototype.exec = function(query, callback) {
  var err = query.validate()

  if (err) {
    return callback(err)
  }

  request({
    url:    this.url + '/druid/v2',
    method: 'POST',
    json:   true,
    body:   query.toJSON()
  }, onresponse)

  function onresponse(err, response, data) {
    if (err) {
      callback(err)
    }
    else if (response.statusCode !== 200) {
      callback(new DruidError('Unknown error (status: %d) while executing query: %j', response.statusCode, data))
    }
    else {
      callback(null, data)
    }
  }
}

