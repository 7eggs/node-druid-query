'use strict'

var FieldError = require('../../errors').FieldError


/**
 * Minimum metric value
 *
 * @see http://druid.io/docs/0.6.120/Aggregations.html
 *
 * @param {string} fieldName name of the metric column
 */
module.exports = function min(fieldName) {
  if (!fieldName) {
    throw new FieldError('Missing metric column')
  }

  this.fieldName = fieldName
}