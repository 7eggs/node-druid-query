'use strict'

var FieldError = require('../../errors').FieldError


/**
 * Cardinality aggregator
 *
 * @see http://druid.io/docs/0.6.120/Aggregations.html
 *
 * @param {string[]} fieldNames Fields to compute cardinality over
 * @param {boolean} [byRow=false] If we should compute cardinality over distinct combinations
 */
module.exports = function cardinality(fieldNames, byRow) {
  if (!fieldNames || !fieldNames.length) {
    throw new FieldError('Missing field names')
  }

  this.fieldNames = fieldNames
  this.byRow = byRow || false
}