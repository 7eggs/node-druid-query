'use strict'

var FieldError = require('../../errors').FieldError


/**
 * Search filter
 *
 * @see http://druid.io/docs/0.9.0/querying/filters.html
 *
 * @param {string} dimension Dimension to which filter is applied
 * @param {object} query Query to filter by
 */
module.exports = function(dimension, query) {
  if (!dimension || !query) {
    throw new FieldError('Dimension or query object is not specified.')
  }

  this.dimension = dimension
  this.query = query
}
