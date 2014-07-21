'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  describe('.orderBy()', function() {
    it('should create spec', function() {
      var spec = Query.orderBy('dimension1', 'descending')

      expect(spec).to.eql({dimension: 'dimension1', direction: 'descending'})
    })

    it('should create spec (string)', function() {
      var spec = Query.orderBy('dimension2')

      expect(spec).to.eql({dimension: 'dimension2', direction: 'ASCENDING'})
    })

    it('should throw error if dimension is not specified', function() {
      expect(function() {
        Query.orderBy(null, 'foobar')
      }).to.throwException()
    })

    it('should throw error if direction is invalid', function() {
      expect(function() {
        Query.orderBy('dimension3', 'foobar')
      }).to.throwException()
    })
  })
})