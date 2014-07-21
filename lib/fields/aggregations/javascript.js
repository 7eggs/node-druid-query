'use strict'

var FieldError = require('../../errors').FieldError


/**
 * JavaScript aggregator
 *
 * @see http://druid.io/docs/0.6.120/Aggregations.html
 *
 * @param {string[]} fieldNames Names of fields which are passed to aggregate function
 * @param {string|Function} aggregateFn Aggregation function
 * @param {string|Function} combineFn Combines partials
 * @param {string|Function} resetFn Reset function
 */
module.exports = function javascript(fieldNames, aggregateFn, combineFn, resetFn) {
  if (!fieldNames || !fieldNames.length || !aggregateFn || !combineFn || !resetFn) {
    throw new FieldError('Some arguments ares missing (btw, all arguments are mandatory)')
  }

  this.fieldNames = fieldNames
  this.aggregateFn = aggregateFn + ''
  this.combineFn = combineFn + ''
  this.resetFn = resetFn + ''
}