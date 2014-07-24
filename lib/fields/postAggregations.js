'use strict'

var FieldError = require('../errors').FieldError
  , utils = require('./../utils')
  , postAggregations = utils.moduleMap(__dirname + '/postAggregations')




/**
 * Add post-aggregation
 *
 * @param {string|object} type Post-aggregator type
 * @param {string} name Post-aggregated field name
 * @param {...*} args Other arguments
 */
exports.postAggregation = function(type, name) {
  return postAggregation.apply(null, arguments)
}
exports.postAggregation.push = 'postAggregations'




/**
 * Set post-aggregations
 *
 * @param {object[]|...object} postAggregations
 */
exports.postAggregations = 'array'




/**
 * Generate post-aggregation object
 *
 * @param {string|object} type Post-aggregation type or post-aggregation object
 * @param {string} name Name of aggregated value
 * @returns {object} Dude, you know? It's a post-aggregation thing!
 */
function postAggregation(type, name) {
  if (utils.isObject(type)) {
    return type
  }

  if (!name) {
    throw new FieldError('Missing post-aggregation name')
  }
  else if (!postAggregations.hasOwnProperty(type)) {
    throw new FieldError('Unknown post-aggregation type: ' + type)
  }

  var args = utils.args(arguments, 2)
    , postAggregation = {
      type: type,
      name: name
    }

  postAggregations[type].apply(postAggregation, args)

  return postAggregation
}