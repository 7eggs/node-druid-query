'use strict'

var FieldError = require('../../errors').FieldError


/**
 * RegexDimExtractionFn
 *
 * @see http://druid.io/docs/0.6.121/DimensionSpecs.html
 *
 * @param {string} regex Regular expression to match
 */
module.exports = function(regex) {
  if (!regex) {
    throw new FieldError('Missing regular expression')
  }

  this.expr = regex + ''
}
