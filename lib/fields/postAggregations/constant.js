'use strict'


/**
 * Constant is constant, your cap!
 *
 * @see http://druid.io/docs/0.6.120/Post-aggregations.html
 *
 * @param {*} value Constant value
 */
module.exports = function(value) {
  this.value = value
}