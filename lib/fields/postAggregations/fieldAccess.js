'use strict'

var FieldError = require('../../errors').FieldError


/**
 * Field-access post-aggregator - returns aggregator value
 *
 * @see http://druid.io/docs/0.6.120/Post-aggregations.html
 *
 * @param {string} [fieldName] Name of aggregator field. If not specified, name is used as fieldName.
 */
module.exports = function(fieldName) {
  if (arguments.length === 0) {
    fieldName = this.name
    delete this.name
  }

  if (!fieldName) {
    throw new FieldError('Aggregator name is not specified')
  }

  this.fieldName = fieldName
}