'use strict'

var utils = require('./../utils')
  , aggregations = utils.moduleMap(__dirname + '/aggregations')




/**
 * Add aggregation
 *
 * @param {string} type Aggregation type
 * @param {string} name Aggregated value name
 * @param {...*} aggregationArguments Other arguments, specific to given aggregation type
 */
exports.aggregation = function(type, name) {
  return aggregation.apply(null, arguments)
}
exports.aggregation.push = 'aggregations'




/**
 * Set aggregations
 *
 * @param {object[]|...object} aggregations
 */
exports.aggregations = function(aggregations) {
  if (Array.isArray(aggregations)) {
    return aggregations
  }
  else {
    return utils.args(arguments, 0)
  }
}




/**
 * Generate aggregation object
 *
 * @param {string|object} type Aggregation type or aggregation object
 * @param {string} name Name of aggregated value
 * @returns {object} Omg, it's aggregation JS object.
 */
function aggregation(type, name) {
  if (typeof type === 'object') {
    return type
  }

  var args = utils.args(arguments, 2)
    , aggregation = {
      type: type,
      name: name
    }

  aggregations[type].apply(aggregation, args)

  return aggregation
}