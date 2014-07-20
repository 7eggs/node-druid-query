'use strict'

var FieldError = require('../../errors').FieldError
  , utils = require('../../utils')
  , arraySetter = utils.fieldSetter(null, 'array')


/**
 * Logical AND filter
 *
 * @see http://druid.io/docs/0.6.120/Filters.html
 *
 * @param {object[]|...object} filters
 */
module.exports = function(filters) {
  if (arguments.length === 0) {
    throw new FieldError('No filters specified')
  }

  this.fields = arraySetter.apply(null, arguments)
}
