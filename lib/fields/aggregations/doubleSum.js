'use strict'


/**
 * Sum of values as 64bit float
 *
 * @see http://druid.io/docs/0.6.120/Aggregations.html
 *
 * @param {string} fieldName name of the metric column to sum over
 */
module.exports = function doubleSum(fieldName) {
  this.fieldName = fieldName
}