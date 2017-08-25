'use strict'

var FieldError = require('../../errors').FieldError


/**
 * In filter
 *
 * @see http://druid.io/docs/0.6.120/Filters.html
 *
 * @param {string} dimension Dimension to which filter is applied
 * @param {*} values Values to match
 */
module.exports = function(dimension, values) {
  if (!dimension || typeof values === 'undefined') {
    throw new FieldError('Dimension or value is not specified')
  }

  // convert to empty string, null/empty string are the same thing to druid
  if (values === null) {
    values = []
  }

  this.dimension = dimension
  this.values = values
}
