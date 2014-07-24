'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#sort()', function() {
    it('should set sort spec', function() {
      var raw = query.sort('lexicographic').toJSON()

      expect(raw.sort).to.eql({
        type:  'lexicographic'
      })
    })

    it('should throw error if bad type is specified', function() {
      expect(function() {
        query.sort(null)
      }).to.throwException()
    })

    it('should throw error if bad type is specified', function() {
      expect(function() {
        query.sort('bad_type')
      }).to.throwException()
    })
  })
})