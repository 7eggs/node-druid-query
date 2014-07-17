'use strict'

var searchQuerySpec = require('../query')
  , utils = require('../../utils')


/**
 * SearchQuerySpecDimExtractionFn
 *
 * @see http://druid.io/docs/0.6.121/DimensionSpecs.html
 * @see http://druid.io/docs/0.6.121/SearchQuerySpec.html
 *
 * @param {object|string} [query] SearchQuerySpec object
 */
module.exports = function(query) {
  if (arguments.length === 1) {
    this.query = query
  }
  else {
    this.query = searchQuerySpec.apply(null, arguments)
  }
}