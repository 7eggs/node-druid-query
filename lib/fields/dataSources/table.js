'use strict'

var FieldError = require('../../errors').FieldError


/**
 * Table data source (default one)
 *
 * @see http://druid.io/docs/0.6.121/DataSource.html
 *
 * @param {string} dataSource Data source name
 */
module.exports = function(dataSource) {
  if (!dataSource) {
    throw new FieldError('Data source is not specified')
  }

  this.name = dataSource
}
