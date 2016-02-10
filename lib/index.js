'use strict'

var Druid = require('./druid')
  , each = require('lodash.foreach')
  , utils = require('./utils')
  , queries = utils.moduleMap(__dirname + '/queries')


module.exports = Druid


// Expose base Druid client
Druid.Client = require('./client')

// Expose base query class
Druid.Query = require('./query')

// And all typed queries
each(queries, function(queryClass) {
  Druid[queryClass.name] = queryClass
})
