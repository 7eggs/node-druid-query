'use strict'

var utils = require('./../utils')
  , metrics = utils.moduleMap(__dirname + '/metrics')

module.exports = metric




/**
 * Generate TopNMetricSpec
 *
 * @see http://druid.io/docs/0.6.121/TopNMetricSpec.html
 * @see {metrics}
 * @param {string|object} type Metric type or string as metric
 * @param {...*} [args] Metric-specific arguments
 * @returns {object} Awesome TopNMetric spec!
 */
function metric(type) {
  if (arguments.length === 1 && ~['object', 'string'].indexOf(typeof type)) {
    return type
  }

  var args = utils.args(arguments, 1)
    , metric = {
      type: type
    }

  metrics[type].apply(metric, args)

  return metric
}