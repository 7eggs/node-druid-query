'use strict'

var Query = require('../query')
  , util = require('util')
  , utils = require('../utils')




/**
 * Expose
 */
module.exports = TimeBoundaryQuery




/**
 * TimeBoundary query
 *
 * @see http://druid.io/docs/0.6.121/TimeBoundaryQuery.html
 * @constructor
 * @extends {Query}
 * @param {Druid|Client} client Client instance
 * @param {object} [rawQuery] Raw query data
 */
function TimeBoundaryQuery(client, rawQuery) {
  Query.call(this, client, rawQuery)
}
util.inherits(TimeBoundaryQuery, Query)


Query.type(TimeBoundaryQuery, 'timeBoundary')
Query.addFields(TimeBoundaryQuery, ['bound'])