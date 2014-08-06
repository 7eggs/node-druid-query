'use strict'

var Query = require('../query')
  , util = require('util')
  , utils = require('../utils')




/**
 * Expose
 */
module.exports = GroupByQuery




/**
 * GroupBy query
 *
 * @see http://druid.io/docs/0.6.121/GroupByQuery.html
 * @constructor
 * @extends {Query}
 * @param {Druid|Client} client Client instance
 * @param {object} [rawQuery] Raw query data
 */
function GroupByQuery(client, rawQuery) {
  Query.call(this, client, rawQuery)
}
util.inherits(GroupByQuery, Query)


Query.type(GroupByQuery, 'groupBy')
Query.required(GroupByQuery, 'dimensions', 'granularity', 'aggregations', 'intervals')
Query.addFields(GroupByQuery, ['granularity', 'dimensions', 'limitSpec', 'filter', 'aggregations', 'postAggregations', 'interval', 'intervals', 'having'])