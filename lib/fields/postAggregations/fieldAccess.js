'use strict'


/**
 * Field-access post-aggregator - returns aggregator value
 *
 * @see http://druid.io/docs/0.6.120/Post-aggregations.html
 *
 * @param {string} fieldName Name of aggregator field
 */
module.exports = function(fieldName) {
  this.fieldName = fieldName
}