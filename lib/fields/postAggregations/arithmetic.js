'use strict'

var utils = require('../../utils')


/**
 * Arithmetic post-aggregator
 *
 * @see http://druid.io/docs/0.6.120/Post-aggregations.html
 *
 * @param {string} op Arithmetic operation: +, -, * or /
 * @param {object[]|...object} fields List of post-aggregations
 */
module.exports = function(op, fields) {
  this.fn = op

  if (Array.isArray(fields)) {
    this.fields = fields
  }
  else {
    this.fields = utils.args(arguments, 1)
  }
}