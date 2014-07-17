'use strict'
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

  if (!~['ascending', 'descending'].indexOf(direction.toLowerCase())) {
    throw new Error('Bad orderBy direction: ' + direction)
  }

  return {
    dimension: dimension,
    direction: direction
  }
}