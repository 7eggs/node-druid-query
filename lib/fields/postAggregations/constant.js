'use strict'

var FieldError = require('../../errors').FieldError


/**
 * Constant is constant, your cap!
 *
 * @see http://druid.io/docs/0.6.120/Post-aggregations.html
 *
 * @param {*} value Constant value
 */
module.exports = function(value) {
  if (arguments.length === 0 || value === undefined) {
    throw new FieldError('Constant must have value')
  }

  this.value = value
}