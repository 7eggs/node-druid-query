'use strict'

var searchQuerySpec = require('../query')
  , utils = require('../../utils')


/**
 * SearchQuerySpecDimExtractionFn
 *
 * @see http://druid.io/docs/0.6.121/DimensionSpecs.html
 * @see http://druid.io/docs/0.6.121/SearchQuerySpec.html
 *
 * @param {object|string|...*} [query] SearchQuerySpec object or arguments for Query.query()
 */
module.exports = function(query) {
  if (typeof query === 'object') {
    this.query = query
  }
  else {
    this.query = searchQuerySpec.apply(null, arguments)
  }
}
