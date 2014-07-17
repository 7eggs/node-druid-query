'use strict'


/**
 * Cardinality aggregator
 *
 * @see http://druid.io/docs/0.6.120/Aggregations.html
 *
 * @param {string[]} fieldNames Fields to compute cardinality over
 * @param {boolean} [byRow=false] If we should compute cardinality over distinct combinations
 */
module.exports = function cardinality(fieldNames, byRow) {
  this.fieldNames = fieldNames
  this.byRow = byRow || false
}