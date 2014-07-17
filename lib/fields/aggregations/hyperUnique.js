'use strict'


/**
 * Compute estimated cardinality or dimension
 *
 * TODO dunno if it may be applied to query?
 *
 * @see http://druid.io/docs/0.6.120/Aggregations.html
 *
 * @param {string} fieldName Dimension name
 */
module.exports = function hyperUnique(fieldName) {
  this.fieldName = fieldName
}