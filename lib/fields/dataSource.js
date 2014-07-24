'use strict'

var FieldError = require('../errors').FieldError
  , utils = require('./../utils')
  , ds = utils.moduleMap(__dirname + '/dataSources')

module.exports = dataSource




/**
 * Set data source
 *
 * @param {string} type Data source as string or as object. Or data source type
 * @param {...*} args Arguments specific to each data source type
 */
function dataSource(type) {
  if (arguments.length === 1 && (utils.isObject(type) || typeof type === 'string')) {
    return type
  }
  else if (!ds.hasOwnProperty(type)) {
    throw new FieldError('Unknown data source type: ' + type)
  }

  var args = utils.args(arguments, 1)
    , dataSource = {
      type: type
    }

  ds[type].apply(dataSource, args)

  return dataSource
}