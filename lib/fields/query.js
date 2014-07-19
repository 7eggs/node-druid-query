'use strict'

var FieldError = require('../errors').FieldError
  , utils = require('../utils')

module.exports = query




/**
 * Set search-query spec
 *
 * @see http://druid.io/docs/0.6.121/SearchQuerySpec.html
 * @param {string} type Query spec type
 * @param {string|string[]|...string} value Value or array of fragments
 * @returns {object}
 */
function query(type, value) {
  // InsensitiveContainsSearchQuerySpec
  if (type === 'insensitive_contains') {
    return {
      type:  'insensitive_contains',
      value: value + ''
    }
  }
  // FragmentSearchQuerySpec
  else if (type === 'fragment') {
    if (!Array.isArray(value)) {
      value = utils.args(arguments, 1)
    }

    return {
      type:   'fragment',
      values: value
    }
  }
  else {
    throw new FieldError('Bad SearchQuerySpec type: ' + type)
  }
}
