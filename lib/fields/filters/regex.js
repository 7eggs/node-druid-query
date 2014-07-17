'use strict'


/**
 * Regex filter
 *
 * @see http://druid.io/docs/0.6.120/Filters.html
 *
 * @param {string} dimension Dimension to which filter is applied
 * @param {string} pattern Java regular expression
 */
module.exports = function(dimension, pattern) {
  this.dimension = dimension
  this.pattern = pattern
}