'use strict'

var FieldError = require('../errors').FieldError
  , utils = require('../utils')
  , formatters = utils.moduleMap(__dirname + '/granularities')

var GRANULARITIES = ['all', 'none', 'minute', 'fifteen_minute', 'thirty_minute', 'hour', 'day',
                     'week', 'month', 'quarter', 'year']

module.exports = granularity




/**
 * Set granularity
 *
 * @param {string|object} granularity Granularity as string or type
 * @param {...*} args Arguments depending on granularity type
 * @returns {string|object}
 */
function granularity(granularity) {
  if (utils.isObject(granularity)) {
    return granularity
  }
  else if (typeof granularity === 'string' && ~GRANULARITIES.indexOf(granularity)) {
    return granularity
  }

  if (!formatters.hasOwnProperty(granularity)) {
    throw new FieldError('Bad granularity type: ' + granularity)
  }

  var args = utils.args(arguments, 1)
    , spec = {
      type: granularity
    }

  formatters[granularity].apply(spec, args)

  return spec
}