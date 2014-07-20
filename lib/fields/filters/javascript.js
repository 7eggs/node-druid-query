'use strict'

var FieldError = require('../../errors').FieldError


/**
 * JavaScript filter
 *
 * @see http://druid.io/docs/0.6.120/Filters.html
 *
 * @param {string} dimension Dimension to which filter is applied
 * @param {Function|string} fn Function to apply (should return boolean value)
 */
module.exports = function(dimension, fn) {
  if (!dimension || !fn) {
    throw new FieldError('Dimension or function is not specified')
  }

  this.dimension = dimension
  this.function = fn + ''
}
