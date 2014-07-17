'use strict'


/**
 * EqualTo spec
 *
 * @see http://druid.io/docs/0.6.120/Filters.html
 *
 * @param {string} metric
 * @param {*} value
 */
module.exports = function(metric, value) {
  this.aggregation = metric
  this.value = value
}