'use strict'

var FieldError = require('../errors').FieldError
  , utils = require('../utils')


/**
 * Add interval
 *
 * @type {interval}
 */
module.exports = interval
module.exports.push = 'intervals'




/**
 * Generate interval string
 *
 * @param {string|number|Date} start Start time or interval string
 * @param {string|number|Date} [end] End time
 * @returns {string} Interval string
 */
function interval(start, end) {
  if (arguments.length === 1 && typeof start === 'string') {
    return start
  }
  else if (arguments.length === 2) {
    var interval = utils.args(arguments, 0)

    return interval.map(function(original) {
      var arg = utils.date(original)

      if (!arg) {
        throw new FieldError('Bad date specified: ' + original)
      }

      return JSON.stringify(arg).replace(/"/g, '')
    }).join('/')
  }
  else {
    throw new FieldError('Bad arguments')
  }
}