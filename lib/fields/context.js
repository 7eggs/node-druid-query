'use strict'

var FieldTypeError = require('../errors').FieldTypeError

module.exports = context




/**
 * Set mystique context field value
 *
 * @param {object} value
 * @returns {object}
 */
function context(value) {
  var out = {}

  value = value || {}

  ;['priority', 'timeout'].forEach(function eachIntKey(key) {
    if (value.hasOwnProperty(key)) {
      out[key] = parseInt(value[key], 10)

      if (isNaN(out[key])) {
        throw new FieldTypeError('context.' + key, 'number')
      }
    }
  })


  if (value.hasOwnProperty('queryId')) {
    out.queryId = value.queryId + ''
  }

  ['bySegment', 'populateCache', 'useCache', 'finalize', 'skipEmptyBuckets'].forEach(function eachBoolKey(key) {
    if (value.hasOwnProperty(key)) {
      out[key] = !!((value[key]||false).valueOf())
    }
  })

  return out
}
