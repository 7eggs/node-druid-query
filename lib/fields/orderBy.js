'use strict'

var FieldError = require('../errors').FieldError

module.exports = orderBy




/**
 * Set orderBy spec
 *
 * @param {string} dimension Dimension to sort by
 * @param {string} direction Sorting direction
 * @returns {object}
 */
function orderBy(dimension, direction) {
  if (arguments.length === 1) {
    direction = 'ASCENDING'
  }

  if (!dimension) {
    throw new FieldError('Dimension is not specified')
  }
  else if (!~['ascending', 'descending'].indexOf(direction.toLowerCase())) {
    throw new FieldError('Bad orderBy direction: ' + direction)
  }

  return {
    dimension: dimension,
    direction: direction
  }
}