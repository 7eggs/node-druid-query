'use strict'

var FieldError = require('../errors').FieldError

module.exports = bound




/**
 * Set bound value
 *
 * @see http://druid.io/docs/latest/TimeBoundaryQuery.html
 * @param {string} value
 * @returns {string}
 */
function bound(value) {
  value += ''

  if (value !== 'minTime' && value !== 'maxTime') {
    throw new FieldError('"bound" field should be equal to minTime or maxTime.')
  }

  return value
}