'use strict'

var FieldTypeError = require('./errors').FieldTypeError
  , fs = require('fs')
  , path = require('path')
  , slice = Array.prototype.slice




/**
 * Arguments object to array
 *
 * @param {Arguments} args
 * @param {number} [num=0] Array#slice start index
 * @returns {Array}
 */
exports.args = function(args, num) {
  if (arguments.length === 1) {
    num = 0
  }

  return slice.call(args, num)
}




/**
 * Load modules from folder and map them to object by filenames.
 *
 * @param {string} dir
 * @returns {Object}
 */
exports.moduleMap = function(dir) {
  var map = {}
  fs.readdirSync(dir).forEach(mapFn)
  function mapFn(filename) {
    var modulePath = path.basename(filename, '.js')
    map[modulePath] = require(path.join(dir, filename))
  }

  return map
}




// Field setters
var FIELD_SETTERS = {
  boolean: function(value) {
    return !!value
  },

  object: function(value) {
    if (typeof value !== 'object') {
      throw new FieldTypeError(this + '', 'object')
    }

    return value
  },

  number: function(value) {
    if (typeof value !== 'number') {
      value = parseFloat(value) || parseInt(value, 10)
    }

    if (isNaN(value)) {
      return FieldTypeError(this + '', 'number')
    }

    return value
  },

  string: function(value) {
    if (typeof value !== 'string') {
      value = value + ''
    }

    return value
  },

  array: function(value) {
    if (!Array.isArray(value)) {
      value = exports.args(arguments, 0)
    }

    return value
  }
}




/**
 * Get needed setter
 *
 * @param {string} field Query field name
 * @param {string} setter Setter name
 */
exports.fieldSetter = function(field, setter) {
  var setterFn = FIELD_SETTERS[setter]
  return setterFn.bind(field)
}