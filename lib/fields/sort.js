'use strict'

var FieldError = require('../errors').FieldError

var SORT_TYPES = ['lexicographic', 'strlen']

module.exports = sort




/**
 * Set sort field
 *
 * @see http://druid.io/docs/0.6.121/SearchQuerySpec.html
 * @param {string} type Sort type
 * @returns {object}
 */
function sort(type) {
  if (!~SORT_TYPES.indexOf(type)) {
    throw new FieldError('Sorting type can be ' + SORT_TYPES.join(' or '))
  }

  return {
    type: type
  }
}