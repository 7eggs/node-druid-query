'use strict'

var FieldError = require('../../errors').FieldError


/**
 * JavaScript post-aggregator
 *
 * @see http://druid.io/docs/0.6.120/Post-aggregations.html
 *
 * @param {string[]} fieldNames List of aggregator names - passed as arguments to function
 * @param {string|Function} fn Post-aggregator function
 */
module.exports = function(fieldNames, fn) {
  if (!fieldNames || fieldNames.length === 0 || !fn) {
    throw new FieldError('Field names or function missing')
  }

  this.fieldNames = fieldNames
  this.function = fn + ''
}