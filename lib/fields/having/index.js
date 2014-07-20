'use strict'

var FieldError = require('../../errors').FieldError
  , utils = require('../../utils')
  , arraySetter = utils.fieldSetter(null, 'array')
  , numberSetter = utils.fieldSetter(null, 'number')


/**
 * AND / OR spec
 *
 * @see http://druid.io/docs/0.6.121/Having.html
 *
 * @param {object[]|*...} specs
 */
exports.array = function(specs) {
  if (arguments.length === 0) {
    throw new FieldError('No specs specified')
  }

  this.havingSpecs = arraySetter.apply(null, arguments)
}




/**
 * Numeric filter
 *
 * @see http://druid.io/docs/0.6.121/Having.html
 *
 * @param {string} aggregation Aggregation name
 * @param {number|string} value
 */
exports.number = function(aggregation, value) {
  if (!aggregation) {
    throw new FieldError('Aggregation name is not specified')
  }

  this.aggregation = aggregation
  this.value = numberSetter(value)
}