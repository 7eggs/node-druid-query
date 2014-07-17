'use strict'

var utils = require('../../utils')


/**
 * Logical AND spec
 *
 * @see http://druid.io/docs/0.6.120/Filters.html
 *
 * @param {object[]|*...} specs
 */
module.exports = function(specs) {
  if (!Array.isArray(specs)) {
    specs = utils.args(arguments, 0)
  }

  this.havingSpecs = specs
}