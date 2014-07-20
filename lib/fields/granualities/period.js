'use strict'

var FieldError = require('../../errors').FieldError
  , utils = require('../../utils')


/**
 * Took here:
 *
 * https://github.com/luisfarzati/moment-interval/blob/master/src/moment-interval.js#L25
 */
var DURATION_REGEXP = /^P(?:(\d+(?:[\.,]\d{0,3})?W)|(\d+(?:[\.,]\d{0,3})?Y)?(\d+(?:[\.,]\d{0,3})?M)?(\d+(?:[\.,]\d{0,3})?D)?(?:T(\d+(?:[\.,]\d{0,3})?H)?(\d+(?:[\.,]\d{0,3})?M)?(\d+(?:[\.,]\d{0,3})?S)?)?)$/

function isISODuration(text) {
  return DURATION_REGEXP.test(text)
}


/**
 * Period setter
 *
 * @see http://druid.io/docs/0.6.121/Granularities.html
 *
 * @param {number|string} period
 * @param {string} [timeZone] Timezone. Default: UTC
 * @param {string|number|Date} [origin] Start time
 */
module.exports = function(period, timeZone, origin) {
  if (!isISODuration(period)) {
    throw new FieldError('Bad duration: ' + period)
  }

  this.period = period

  if (typeof timeZone === 'string') {
    this.timeZone = timeZone
  }

  origin = utils.date(origin)
  if (origin) {
    this.origin = origin
  }
}