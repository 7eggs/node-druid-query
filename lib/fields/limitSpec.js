'use strict'
module.exports = limitSpec




/**
 * Set limit spec
 *
 * @see http://druid.io/docs/0.6.120/LimitSpec.html
 * @param {string} [type=default] Type of LimitSpec
 * @param {number} limit Limit of records
 * @param {object[]} orderByColumns
 * returns {object}
 */
function limitSpec(type, limit, orderByColumns) {
  return {
    type:    type,
    limit:   limit,
    columns: orderByColumns
  }
}