'use strict'

var FieldError = require('../../errors').FieldError
  , utils = require('../../utils')


/**
 * Arithmetic post-aggregator
 *
 * @see http://druid.io/docs/0.6.120/Post-aggregations.html
 *
 * @param {string} op Arithmetic operation: +, -, * or /
 * @param {object[]|...object} fields List of post-aggregations
 */
module.exports = function(op, fields) {
  if (!op) {
    throw new FieldError('Arithmetic function (+, -, *, /) is not specified')
  }

  if (!Array.isArray(fields)) {
    fields = utils.args(arguments, 1)
  }

  if (fields.length === 0) {
    throw new FieldError('Fields are not specified')
  }

  this.fn = op
  this.fields = fields
}