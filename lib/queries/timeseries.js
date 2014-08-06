'use strict'

var Query = require('../query')
  , util = require('util')
  , utils = require('../utils')




/**
 * Expose
 */
module.exports = TimeseriesQuery




/**
 * Timeseries query
 *
 * @see http://druid.io/docs/0.6.121/TimeseriesQuery.html
 * @constructor
 * @extends {Query}
 * @param {Druid|Client} client Client instance
 * @param {object} [rawQuery] Raw query data
 */
function TimeseriesQuery(client, rawQuery) {
  Query.call(this, client, rawQuery)
}
util.inherits(TimeseriesQuery, Query)


Query.type(TimeseriesQuery, 'timeseries')
Query.required(TimeseriesQuery, 'granularity', 'aggregations', 'intervals')
Query.addFields(TimeseriesQuery, ['granularity', 'filter', 'aggregations', 'postAggregations', 'interval', 'intervals'])