'use strict'

var expect = require('expect.js')
  , Query = require('../../lib/index').Query


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('queryType', function() {
    it('should set queryType', function() {
      query.queryType('groupBy')

      expect(query._query.queryType).to.be('groupBy')
      expect(typeof query._query.queryType).to.be('string')
    })

    it('should convert input value to string', function() {
      query.queryType(new String('groupBy'))

      expect(query._query.queryType).to.be('groupBy')
      expect(typeof query._query.queryType).to.be('string')
    })
  })
})