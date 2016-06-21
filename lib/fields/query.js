'use strict'

var FieldError = require('../errors').FieldError
  , utils = require('../utils')

module.exports = query




/**
 * Set search-query spec
 *
 * @see http://druid.io/docs/0.6.121/SearchQuerySpec.html
 * @param {string|object} type Query spec type
 * @param {string|string[]} value Value or array of fragments
 * @param {boolean} caseSensitive Whether strings should be compared as case sensitive or not
 * @returns {object}
 */
function query(type, value, caseSensitive) {
  if (utils.isObject(type)) {
    return type
  }
  else if (!type || !value) {
    throw new FieldError('Type or value is not specified')
  }

  // InsensitiveContainsSearchQuerySpec
  else if (type === 'insensitive_contains') {
    return {
      type:  'insensitive_contains',
      value: value + ''
    }
  }
  // FragmentSearchQuerySpec
  else if (type === 'fragment') {
    if (!Array.isArray(value)) {
      throw new FieldError('value is not an array')
    }

    return {
      type:   'fragment',
      values: value,
      caseSensitive: caseSensitive || false
    }
  }
  else if (type === 'contains') {
    return {
      type:  'contains',
      value: value + '',
      caseSensitive: caseSensitive || false
    }
  }
  else {
    throw new FieldError('Bad SearchQuerySpec type: ' + type)
  }
}
