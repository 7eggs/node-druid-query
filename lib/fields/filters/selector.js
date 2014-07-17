'use strict'


/**
 * Selector filter
 *
 * @see http://druid.io/docs/0.6.120/Filters.html
 *
 * @param {string} dimension Dimension to which filter is applied
 * @param {*} value Value to match
 */
module.exports = function(dimension, value) {
  this.dimension = dimension
  this.value = value
}