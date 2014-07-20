'use strict'

var FieldError = require('../../errors').FieldError
  , filterSpec


/**
 * Logical NOT filter
 *
 * @see http://druid.io/docs/0.6.120/Filters.html
 *
 * @param {object|...*} filter spec or arguments for Query.filter()
 */
module.exports = function(filter) {
  if (arguments.length === 0) {
    throw new FieldError('Filter is not specified')
  }

  if (typeof filter !== 'object') {
    !filterSpec && (filterSpec = require('../filter'))

    filter = filterSpec.apply(null, arguments)
  }

  this.field = filter
}
