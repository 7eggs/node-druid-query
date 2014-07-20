'use strict'

var FieldError = require('../../errors').FieldError
  , havingSpec


/**
 * Logical NOT spec
 *
 * @see http://druid.io/docs/0.6.121/Having.html
 *
 * @param {object|...*} spec spec or arguments for Query.having()
 */
module.exports = function(spec) {
  if (arguments.length === 0) {
    throw new FieldError('Spec is not specified')
  }

  if (typeof spec !== 'object') {
    !havingSpec && (havingSpec = require('../having.js'))

    spec = havingSpec.apply(null, arguments)
  }

  this.havingSpec = spec
}
