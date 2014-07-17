'use strict'

var utils = require('../../utils')


/**
 * Logical OR filter
 *
 * @see http://druid.io/docs/0.6.120/Filters.html
 *
 * @param {object[]|...object} filters
 */
module.exports = function(filters) {
  if (!Array.isArray(filters)) {
    filters = utils.args(arguments, 0)
  }

  this.fields = filters
}