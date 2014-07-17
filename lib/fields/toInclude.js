'use strict'

var FieldError = require('../errors').FieldError

module.exports = toInclude




/**
 * Set toInclude field
 *
 * @see http://druid.io/docs/0.6.121/SegmentMetadataQuery.html
 * @param {string|string[]} value
 * @returns {object}
 */
function toInclude(value) {
  if (typeof value === 'string' && (value === 'all' || value === 'none')) {
    return {
      type: value
    }
  }
  else if (Array.isArray(value)) {
    return {
      type:    'list',
      columns: value
    }
  }
  else {
    throw new FieldError('Unknown toInclude value: ' + value)
  }
}