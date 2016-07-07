'use strict'

var FieldError = require('../errors').FieldError

module.exports = dimension




/**
 * Set dimension spec
 *
 * Depending on arguments length creates default or extraction dimension spec.
 *
 * If second or third argument is object ExtractionDimensionSpec is created.
 *
 * In other cases DefaultDimensionSpec is created.
 *
 * @see http://druid.io/docs/0.6.121/DimensionSpecs.html
 * @param {string|object} dimension Dimension name or dimension object
 * @param {string} [outputName] Renamed name
 * @param {object} [fn] Extraction function object
 * @returns {object}
 */
function dimension(dimension, outputName, fn) {
  if (!dimension) {
    throw new FieldError('At least dimension must be specified')
  }

  if (arguments.length === 1 && typeof dimension === 'object') {
    return dimension
  }

  if (arguments.length === 1) {
    return {
      type:      'default',
      dimension: dimension
    }
  }
  else if (arguments.length === 2 && typeof outputName !== 'object') {
    return {
      type:       'default',
      dimension:  dimension,
      outputName: outputName
    }
  }
  else if (arguments.length === 2) {
    fn = outputName

    return {
      type:            'extraction',
      dimension:       dimension,
      dimExtractionFn: fn
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
    throw new FieldError('Bad arguments number: ' + arguments.length)
  }
}
