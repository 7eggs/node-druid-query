'use strict'

var FieldError = require('../../errors').FieldError

module.exports = numeric


/**
 * Numeric TopNMetricSpec
 *
 * @see http://druid.io/docs/0.6.121/TopNMetricSpec.html
 *
 * @param {string} metric
 */
function numeric(metric) {
  if (!metric) {
    throw new FieldError('Metric is not specified')
  }

  this.metric = metric + ''
}
