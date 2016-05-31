'use strict'

var errors = require('../errors')
  , utils = require('../utils')
  , FieldError = errors.FieldError
  , FieldTypeError = errors.FieldTypeError

module.exports = limitSpec




/**
 * Set limit spec
 *
 * @see http://druid.io/docs/0.6.120/LimitSpec.html
 * @param {string|object} [type=default] Type of LimitSpec or LimitSpec object
 * @param {number} [limit] Limit of records
 * @param {object[]} [orderByColumns] Sorting columns
 * returns {object}
 */
function limitSpec(type, limit, orderByColumns) {
  if (utils.isObject(type)) {
    return type
  }

  if (typeof limit !== 'number') {
    limit = parseInt(limit, 10)
  }

  if (type !== 'default') {
    throw new FieldError('Currently only DefaultLimitSpec is supported')
  }
  else if (isNaN(limit)) {
    throw new FieldTypeError('limitSpec.limit', 'number')
  }
  else if (!Array.isArray(orderByColumns)) {
    throw new FieldTypeError('limitSpec.columns', 'array')
  }

  return {
    type:    type,
    limit:   parseInt(limit, 10),
    columns: orderByColumns
  }
}