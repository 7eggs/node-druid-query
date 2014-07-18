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

  if (value.hasOwnProperty('priority')) {
    out.priority = parseInt(value.priority, 10)

    if (isNaN(out.priority)) {
      throw new FieldTypeError('context.priority', 'number')
    }
  }

  ['bySegment', 'populateCache', 'useCache', 'finalize'].forEach(function(key) {
    if (value.hasOwnProperty(key)) {
      out[key] = !!((value[key]||false).valueOf())
    }
  })

  return out
}