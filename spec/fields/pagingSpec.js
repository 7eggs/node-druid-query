'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('pagingSpec', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#pagingSpec()', function() {
    it('should set pagingSpec', function() {
      var raw = query.pagingSpec(true, 10, {}).toJSON()

      expect(raw.pagingSpec).to.eql({
        fromNext:    true,
        threshold:   10,
        pagingIdentifiers: {}
      })
    })

    it('should convert threshold to number', function() {
      var raw = query.pagingSpec(true, '10', {}).toJSON()

      expect(raw.pagingSpec).to.eql({
        fromNext:    true,
        threshold:   10,
        pagingIdentifiers: {}
      })
    })

    it('should throw error if bad threshold specified', function() {
      expect(function() {
        query.pagingSpec(true, null, {})
      }).to.throwException()
    })

    it('should default to empty object if pagingIdentifiers is omitted', function() {
      var raw = query.pagingSpec(true, 10).toJSON()

      expect(raw.pagingSpec).to.eql({
        fromNext:    true,
        threshold:   10,
        pagingIdentifiers: {}
      })
    })

    it('should throw error if bad pagingIdentifiers specified', function() {
      expect(function() {
        query.pagingSpec(true, 10, null)
      }).to.throwException()
    })
  })
})
