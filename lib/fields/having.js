'use strict'

var FieldError = require('../errors').FieldError
  , utils = require('./../utils')
  , specs = utils.moduleMap(__dirname + '/having')

module.exports = having




/**
 * Generate Having field
 *
 * @see http://druid.io/docs/0.6.120/Having.html
 * @param {string|object} type Filter type or ready filter object
 * @returns {object} Brand new ready to use filter!
 */
function having(type) {
  if (utils.isObject(type)) {
    return type
  }
  else if (!specs.hasOwnProperty(type)) {
    throw new FieldError('Bad having type: ' + type)
  }

  var args = utils.args(arguments, 1)
    , having = {
      type: type
    }

  specs[type].apply(having, args)

  return having
}