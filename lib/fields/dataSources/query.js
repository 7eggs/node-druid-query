'use strict'

var FieldError = require('../../errors').FieldError
  , Query = require('../../query')


/**
 * Query data source
 *
 * @see http://druid.io/docs/0.6.121/DataSource.html
 *
 * @param {Query|object} query Query instance or raw query object
 */
module.exports = function(query) {
  if (typeof query !== 'object') {
    throw new FieldError('Bad query: ' + query)
  }

  if (query instanceof Query) {
    this.query = query.toJSON()
  }
  else {
    this.query = query
  }
}
