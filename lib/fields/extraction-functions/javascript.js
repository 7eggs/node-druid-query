'use strict'


/**
 * JavascriptDimExtractionFn
 *
 * @see http://druid.io/docs/0.6.121/DimensionSpecs.html
 *
 * @param {string|Function} fn
 */
module.exports = function(fn) {
  this.function = fn + ''
}