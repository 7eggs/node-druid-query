'use strict'

var FieldError = require('../errors').FieldError

module.exports = dimension




/**
 * Set dimension spec
 *
 * Depending on arguments length creates default or extraction dimension spec.
 *
 * If one or two arguments are specified DefaultDimensionSpec is created.
 *
 * If all arguments are specified ExtractionDimensionSpec is created.
 *
 * @see http://druid.io/docs/0.6.121/DimensionSpecs.html
 * @param {string} dimension Dimension name
 * @param {string} [outputName] Renamed name
 * @param {object} [fn] Extraction function object
 * @returns {object}
 */
function dimension(dimension, outputName, fn) {
  if (arguments.length === 1) {
    return {
      type:      'default',
      dimension: dimension
    }
  }
  else if (arguments.length === 2) {
    return {
      type:       'default',
      dimension:  dimension,
      outputName: outputName
    }
  }
  else if (arguments.length === 3) {
    return {
      type:            'extraction',
      dimension:       dimension,
      outputName:      outputName,
      dimExtractionFn: fn
    }
  }
  else {
    throw new FieldError('Bad arguments for dimension field')
  }
}