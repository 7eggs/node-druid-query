'use strict'

var FieldError = require('../../errors').FieldError


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
  if (!fieldName) {
    throw new FieldError('Missing dimension')
  }

  this.fieldName = fieldName
}