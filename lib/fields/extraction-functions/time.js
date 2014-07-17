'use strict'


/**
 * TimeDimExtractionFn
 *
 * @see http://druid.io/docs/0.6.121/DimensionSpecs.html
 *
 * @param {string} input Input time format
 * @param {string} output Output time format
 */
module.exports = function(input, output) {
  this.timeFormat = input
  this.resultFormat = output
}