'use strict'

var FieldError = require('../../errors').FieldError
  , utils = require('../../utils')


/**
 * Duration granularity
 *
 * @see http://druid.io/docs/0.6.121/Granularities.html
 *
 * @param {string|number} duration Duration in ms
 * @param {string|number|Date} [origin] Start timestamp
 */
module.exports = function(duration, origin) {
  var durationNumber = parseInt(duration, 10)

  if (isNaN(durationNumber)) {
    throw new FieldError('Bad duration value: ' + duration)
  }

  this.duration = duration + ''
  origin = utils.date(origin)
  if (origin) {
    this.origin = origin
  }
}