'use strict';

var FieldTypeError = require('../errors').FieldTypeError

module.exports = metrics




/**
 * Generate metrics used in Select
 *
 * @see http://druid.io/docs/0.6.121/SelectQuery.html
 * @param   {array} fields A String array of metrics to select
 * @returns {array}
 */
function metrics(fields) {
  if (!fields) {
    return []
  }

  if (!Array.isArray(fields)) {
    throw new FieldTypeError('metrics.fields', 'array')
  }

  return fields
}
