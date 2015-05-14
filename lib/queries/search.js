'use strict'

var Query = require('../query')
  , util = require('util')
  , utils = require('../utils')




/**
 * Expose
 */
module.exports = SearchQuery




/**
 * Search query
 *
 * @see http://druid.io/docs/0.6.121/SearchQuery.html
 * @constructor
 * @extends {Query}
 * @param {Druid|Client} client Client instance
 * @param {object} [rawQuery] Raw query data
 */
function SearchQuery(client, rawQuery) {
  Query.call(this, client, rawQuery)
}
util.inherits(SearchQuery, Query)


Query.type(SearchQuery, 'search')
Query.required(SearchQuery, 'granularity', 'intervals', 'query', 'sort')
Query.addFields(SearchQuery, ['granularity', 'searchDimensions', 'query', 'sort', 'interval', 'intervals', 'filter'])