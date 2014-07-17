'use strict'

var utils = require('./../utils')
  , filters = utils.moduleMap(__dirname + '/filters')

module.exports = filter




/**
 * Generate query filter object
 *
 * @param {string|object} type Filter type or ready filter object
 * @returns {object} Brand new ready to use filter!
 */
function filter(type) {
  if (typeof type === 'object') {
    return type
  }

  var args = utils.args(arguments, 1)
    , filter = {
      type: type
    }

  filters[type].apply(filter, args)

  return filter
}