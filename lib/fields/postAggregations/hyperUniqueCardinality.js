'use strict'


/**
 * JavaScript post-aggregator
 *
 * @see http://druid.io/docs/0.6.120/Post-aggregations.html
 *
 * @param {string} fieldName Name of hyperUnique aggregator
 */
module.exports = function(fieldName) {
  this.fieldName = fieldName
}