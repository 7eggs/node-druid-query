'use strict'

var FieldError = require('../errors').FieldError
  , utils = require('./../utils')
  , fns = utils.moduleMap(__dirname + '/extraction-functions')

module.exports = extractionFunction




/**
 * Generate dimension extraction function object
 *
 * @see http://druid.io/docs/0.6.121/DimensionSpecs.html
 * @see {extractionFunctions}
 * @param {string|object} type Extraction function type
 * @param {...*} arguments Extraction-specific arguments
 * @returns {object} Best extraction function object ever
 */
function extractionFunction(type) {
  if (utils.isObject(type)) {
    return type
  }
  else if (!fns.hasOwnProperty(type)) {
    throw new FieldError('Unknown DimExtractionFn type: ' + type) 
  }

  var args = utils.args(arguments, 1)
    , fn = {
      type: type
    }

  fns[type].apply(fn, args)

  return fn
}
