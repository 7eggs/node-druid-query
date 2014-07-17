'use strict'

var FieldError = require('../../errors').FieldError


/**
 * Maximum metric value
 *
 * @see http://druid.io/docs/0.6.120/Aggregations.html
 *
 * @param {string} fieldName name of the metric column
 */
module.exports = function max(fieldName) {
  if (!fieldName) {
    throw new FieldError('Missing metric column')
  }

  this.fieldName = fieldName
}