'use strict'

var Query = require('../query')
  , util = require('util')
  , utils = require('../utils')




/**
 * Expose
 */
module.exports = SelectQuery




/**
 * Select query
 *
 * @see http://druid.io/docs/0.6.121/SelectQuery.html
 * @constructor
 * @extends {Query}
 * @param {Druid|Client} client Client instance
 * @param {object} [rawQuery] Raw query data
 */
function SelectQuery(client, rawQuery) {
  Query.call(this, client, rawQuery)
}
util.inherits(SelectQuery, Query)


Query.type(SelectQuery, 'select')
Query.required(SelectQuery, 'intervals', 'pagingSpec')
Query.addFields(SelectQuery, ['granularity', 'dimensions', 'descending', 'filter', 'metrics', 'intervals'])
