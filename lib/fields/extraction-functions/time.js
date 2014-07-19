'use strict'

var FieldError = require('../../errors').FieldError


/**
 * TimeDimExtractionFn
 *
 * @see http://druid.io/docs/0.6.121/DimensionSpecs.html
 *
 * @param {string} input Input time format
 * @param {string} output Output time format
 */
module.exports = function(input, output) {
  if (!input || !output) {
    throw new FieldError('timeFormat or resultFormat is not specified')
  }

  this.timeFormat = input
  this.resultFormat = output
}
