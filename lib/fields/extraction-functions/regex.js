'use strict'


/**
 * RegexDimExtractionFn
 *
 * @see http://druid.io/docs/0.6.121/DimensionSpecs.html
 *
 * @param {string|RegExp} regex Regular expression to match
 */
module.exports = function(regex) {
  this.expr = regex
}