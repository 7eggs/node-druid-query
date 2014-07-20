'use strict'

var FieldError = require('../../errors').FieldError


/**
 * Selector filter
 *
 * @see http://druid.io/docs/0.6.120/Filters.html
 *
 * @param {string} dimension Dimension to which filter is applied
 * @param {*} value Value to match
 */
module.exports = function(dimension, value) {
  if (!dimension || !value) {
    throw new FieldError('Dimension or value is not specified')
  }

  this.dimension = dimension
  this.value = value
}
