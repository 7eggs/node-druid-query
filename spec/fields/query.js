'use strict'

var Query = require('../../').Query
  , util = require('util')


/**
 * Base query class
 *
 * @constructor
 */
function TestQuery(client, rawQuery) {
  Query.call(this, client, rawQuery)
}
util.inherits(TestQuery, Query)


Query.addFields(TestQuery, ['aggregations', 'bound', 'context', 'dimension', 'dimensions', 'filter', 'granularity', 'having', 'interval', 'intervals', 'limitSpec', 'merge', 'metric', 'postAggregations', 'query', 'searchDimensions', 'sort', 'threshold', 'toInclude'])
Query.addStatic(TestQuery, ['aggregations', 'extractionFunction', 'filter', 'having', 'interval', 'orderBy', 'postAggregations', 'query'])


module.exports = TestQuery
