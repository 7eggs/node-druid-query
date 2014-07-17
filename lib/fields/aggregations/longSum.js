'use strict'

var FieldError = require('../../errors').FieldError


/**
 * Sum of values as long 64bit signed integer
 *
 * @see http://druid.io/docs/0.6.120/Aggregations.html
 *
 * @param {string} fieldName name of the metric column to sum over
 */
module.exports = function longSum(fieldName) {
  if (!fieldName) {
    throw new FieldError('Missing metric column')
  }

  this.fieldName = fieldName
}