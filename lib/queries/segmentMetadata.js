'use strict'

var Query = require('../query')
  , util = require('util')
  , utils = require('../utils')




/**
 * Expose
 */
module.exports = SegmentMetadataQuery




/**
 * SegmentMetadata query
 *
 * @see http://druid.io/docs/0.6.121/SegmentMetadataQuery.html
 * @constructor
 * @extends {Query}
 * @param {Druid|Client} client Client instance
 * @param {object} [rawQuery] Raw query data
 */
function SegmentMetadataQuery(client, rawQuery) {
  Query.call(this, client, rawQuery)
}
util.inherits(SegmentMetadataQuery, Query)


Query.type(SegmentMetadataQuery, 'segmentMetadata')
Query.addFields(SegmentMetadataQuery, ['interval', 'intervals', 'toInclude', 'merge'])
