'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#bound()', function() {
    it('should set minTime bound', function() {
      var raw = query.bound('minTime').bound()

      expect(raw).to.be('minTime')
    })

    it('should set maxTime bound', function() {
      var raw = query.bound('maxTime').bound()

      expect(raw).to.be('maxTime')
    })

    it('should throw error if bound is invalid', function() {
      expect(function() {
        query.bound('bad_bound')
      }).to.throwException()
    })
  })
})