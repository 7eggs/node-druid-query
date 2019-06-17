'use strict'

var FieldError = require('../../errors').FieldError


/**
 * JavaScript aggregator
 *
 * @see http://druid.io/docs/0.6.120/Aggregations.html
 *
 * @param {string[]} fieldNames Names of fields which are passed to aggregate function
 * @param {string|Function} fnAggregate Aggregation function
 * @param {string|Function} fnCombine Combines partials
 * @param {string|Function} fnReset Reset function
 */
module.exports = function javascript(fieldNames, fnAggregate, fnCombine, fnReset) {
  if (!fieldNames || !fieldNames.length || !fnAggregate || !fnCombine || !fnReset) {
    throw new FieldError('Some arguments ares missing (btw, all arguments are mandatory)')
  }

  this.fieldNames = fieldNames
  this.fnAggregate = fnAggregate + ''
  this.fnCombine = fnCombine + ''
  this.fnReset = fnReset + ''
}
