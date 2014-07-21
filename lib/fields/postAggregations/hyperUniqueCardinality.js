'use strict'

var FieldError = require('../../errors').FieldError


/**
 * JavaScript post-aggregator
 *
 * @see http://druid.io/docs/0.6.120/Post-aggregations.html
 *
 * @param {string} [fieldName] Name of hyperUnique aggregator. If not specified, name is used as fieldName.
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