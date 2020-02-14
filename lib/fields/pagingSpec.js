'use strict'

var errors = require('../errors')
  , utils = require('../utils')
  , FieldTypeError = errors.FieldTypeError

module.exports = pagingSpec




/**
 * Set paging spec
 *
 * @see http://druid.io/docs/latest/querying/select-query.html
 * @param {boolean}  [fromNext=true]     Automatically increment the offset
 * @param {number}   [threshold]          How many hits are returned
 * @param {object}   [pagingIdentifiers={}] Manually provide paging identifiers if fromNext is false
 * returns {object}
 */
function pagingSpec(fromNext, threshold, pagingIdentifiers) {
  if (typeof threshold !== 'number') {
    threshold = parseInt(threshold, 10)
  }

  if (typeof fromNext !== 'boolean') {
    fromNext = !!fromNext;
  }
  else if (isNaN(threshold)) {
    throw new FieldTypeError('pagingSpec.threshold', 'number')
  }
  else if (pagingIdentifiers === undefined) {
    pagingIdentifiers = {};
  }
  else if (!utils.isObject(pagingIdentifiers)) {
    throw new FieldTypeError('pagingSpec.pagingIdentifiers', 'object')
  }

  return {
    fromNext: fromNext,
    threshold: parseInt(threshold, 10),
    pagingIdentifiers: pagingIdentifiers
  }
}
