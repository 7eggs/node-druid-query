'use strict'

var undefined

module.exports = lexicographic


/**
 * Lexicographic TopNMetricSpec
 *
 * @see http://druid.io/docs/0.6.121/TopNMetricSpec.html
 *
 * @param {string} previousStop
 */
function lexicographic(previousStop) {
  if (previousStop !== undefined) {
    this.previousStop = previousStop + ''
  }
}
