'use strict'

var undefined

module.exports = alphaNumeric


/**
 * AlphaNumeric TopNMetricSpec
 *
 * @see http://druid.io/docs/0.6.121/TopNMetricSpec.html
 *
 * @param {string} previousStop
 */
function alphaNumeric(previousStop) {
  if (previousStop !== undefined) {
    this.previousStop = previousStop + ''
  }
}
