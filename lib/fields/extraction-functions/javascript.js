'use strict'

var FieldError = require('../../errors').FieldError


/**
 * JavascriptDimExtractionFn
 *
 * @see http://druid.io/docs/0.6.121/DimensionSpecs.html
 *
 * @param {string|Function} fn
 */
module.exports = function(fn) {
  if (typeof fn !== 'string' && typeof fn !== 'function') {
    throw new FieldError('Function is not specified')
  }

  this.function = fn + ''
}
