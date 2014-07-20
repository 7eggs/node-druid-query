'use strict'

var lodash = require('lodash')
  , MissingFieldError = require('./errors').MissingFieldError
  , utils = require('./utils')




/**
 * Load fields setters
 *
 * @param {string[]} list List of fields
 * @param {function} callback Accepts arguments: (methods)
 */
function loadFields(list, callback) {
  list.forEach(loadMethods)

  function loadMethods(field) {
    var module = require('./fields/' + field + '.js')
      , methods

    if (typeof module === 'function' || typeof module === 'string') {
      methods = {}
      methods[field] = module
    }
    else {
      methods = module
    }

    callback(methods)
  }
}




/**
 * Expose Query
 */
module.exports = Query




/**
 * Druid query representation
 *
 * @class
 * @constructor
 * @param {Druid} client Client instance
 * @param {object} [rawQuery] Raw query data
 */
function Query(client, rawQuery) {
  if (client) {
    /**
     * If set, query is attached to given client instance
     *
     * @private
     * @type {Druid}
     */
    this.client = client
  }


  /**
   * Actual query object
   *
   * @private
   */
  this._query = {
    queryType: this._queryType
  }

  if (rawQuery) {
    // we do not want to change query type, aren't we?
    this._queryType && delete rawQuery.queryType

    lodash.assign(this._query, rawQuery)
  }
}




/**
 * Add field setters
 *
 * @static
 * @public
 * @param {function} queryClass Query descendant
 * @param {string[]} fieldList List of fields query has
 */
Query.addFields = function(queryClass, fieldList) {
  var proto = queryClass.prototype

  loadFields(fieldList, addMethods)

  function addMethods(methods) {
    lodash.each(methods, eachMethod)

    function eachMethod(fn, name) {
      if (typeof fn === 'string') {
        fn = utils.fieldSetter(name, fn)
      }

      // "push" property points to array query field
      // so we push item returned by function fn to this array
      if (fn.push) {
        var collection = fn.push

        proto[name] = function() {
          if (!Array.isArray(this._query[collection])) {
            this._query[collection] = []
          }

          this._query[collection].push(fn.apply(null, arguments))

          return this
        }
      }
      else {
        proto[name] = function() {
          this._query[name] = fn.apply(null, arguments)

          return this
        }
      }
    }
  }
}




/**
 * Add static field methods
 *
 * @static
 * @public
 * @param {function} queryClass Query descendant
 * @param {string[]} fieldList List of fields query has
 */
Query.addStatic = function(queryClass, fieldList) {
  loadFields(fieldList, addMethods)

  function addMethods(methods) {
    lodash.each(methods, eachMethod)
  }

  function eachMethod(fn, name) {
    if (typeof fn === 'string') {
      fn = utils.fieldSetter(name, fn)
    }

    queryClass[name] = fn
  }
}




/**
 * Add required fields
 *
 * @static
 * @public
 * @param {function} queryClass Query descendant
 * @param {...string} fields List of required fields
 */
Query.required = function(queryClass, fields) {
  fields = utils.args(arguments, 1)

  queryClass.prototype._required = ['queryType', 'dataSource'].concat(fields)
}




/**
 * Set query type
 *
 * @static
 * @public
 * @param {function} queryClass Query descendant
 * @param {string} type Query type
 */
Query.type = function(queryClass, type) {
  queryClass.prototype._queryType = type
}




/**
 * List of required query fields
 *
 * @private
 * @type {Array}
 */
Query.prototype._required = ['queryType', 'dataSource']




/**
 * Query type
 *
 * @private
 * @type {string}
 */
Query.prototype._queryType = null




/**
 * Execute query
 *
 * @public
 * @param {Query~execCallback} callback Called after query execution
 */
Query.prototype.exec = function(callback) {
  if (!this.client) {
    throw new Error('Query is not attached. Use Druid#exec(query, callback) instead!')
  }

  this.client.exec(this, callback)
}




/**
 * Return query object
 *
 * @public
 * @returns {object}
 */
Query.prototype.toJSON = function() {
  return this._query
}




/**
 * Validate query data
 *
 * @public
 * @returns {Error|null}
 */
Query.prototype.validate = function() {
  var field
    , i = 0

  while (field = this._required[i++]) {
    if (!this._query.hasOwnProperty(field)) {
      return new MissingFieldError(field, this._query.queryType)
    }
  }

  return null
}




// type and dataSource exist in every query
Query.addFields(Query, ['queryType', 'dataSource'])
Query.addStatic(Query, ['aggregations', 'extractionFunction', 'filter', 'having', 'orderBy', 'postAggregations', 'query'])