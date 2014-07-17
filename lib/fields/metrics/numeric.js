'use strict'

/**
 * @module {metrics}
 */
module.exports = numeric


/**
 * Numeric TopNMetricSpec
 *
 * @see http://druid.io/docs/0.6.121/TopNMetricSpec.html
 *
 * @param {string} metric
 */
function numeric(metric) {
  this.metric = metric
}
