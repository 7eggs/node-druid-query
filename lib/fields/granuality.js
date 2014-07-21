'use strict'

var FieldError = require('../errors').FieldError
  , utils = require('../utils')
  , formatters = utils.moduleMap(__dirname + '/granualities')

var GRANUALITIES = ['all', 'none', 'minute', 'fifteen_minute', 'thirty_minute', 'hour', 'day']

module.exports = granuality




/**
 * Set granuality
 *
 * @param {string|object} granuality Granuality as string or type
 * @param {...*} args Arguments depending on granuality type
 * @returns {string|object}
 */
function granuality(granuality) {
  if (typeof granuality === 'object') {
    return granuality
  }
  else if (typeof granuality === 'string' && ~GRANUALITIES.indexOf(granuality)) {
    return granuality
  }

  if (!formatters.hasOwnProperty(granuality)) {
    throw new FieldError('Bad granuality type: ' + granuality)
  }

  var args = utils.args(arguments, 1)
    , spec = {
      type: granuality
    }

  formatters[granuality].apply(spec, args)

  return spec
}