'use strict'

var FieldError = require('../errors').FieldError
  , utils = require('./../utils')
  , filters = utils.moduleMap(__dirname + '/filters')

module.exports = filter




/**
 * Generate query filter object
 *
 * @param {string|object} type Filter type or ready filter object
 * @returns {object} Brand new ready to use filter!
 */
function filter(type) {
  if (utils.isObject(type)) {
    return type
  }
  else if (!filters.hasOwnProperty(type)) {
    throw new FieldError('Bad filter type: ' + type)
  }

  var args = utils.args(arguments, 1)
    , filter = {
      type: type
    }

  filters[type].apply(filter, args)

  return filter
}
