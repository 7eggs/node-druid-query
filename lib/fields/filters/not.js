'use strict'


/**
 * Logical NOT filter
 *
 * @see http://druid.io/docs/0.6.120/Filters.html
 *
 * @param {object} filter
 */
module.exports = function(filter) {
  this.field = filter
}