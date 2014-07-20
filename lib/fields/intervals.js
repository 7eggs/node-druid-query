'use strict'

var FieldError = require('../errors').FieldError
  , utils = require('../utils')

module.exports = intervals




/**
 * Set intervals
 *
 * Use two date arguments if you specify one interval.
 *
 * In other cases use array arguments: each one will represent different interval.
 *
 * @param {string|number|Date} [start] Start time
 * @param {string|number|Date} [end] End time
 * @param {...array} [intervals]
 * @returns {string[]}
 */
function intervals(start, end, intervals) {
  if (arguments.length === 0) {
    throw new FieldError('At least one interval should be specified')
  }
  else if (!Array.isArray(start)) {
    intervals = [utils.args(arguments, 0)]
  }
  else {
    intervals = utils.args(arguments, 0)
  }

  return intervals.map(function(interval) {
    return interval.map(function(arg) {
      arg = utils.date(arg)

      if (!arg) {
        throw new FieldError('Bad date specified')
      }

      return JSON.stringify(arg).replace(/"/g, '')
    }).join('/')
  })
}