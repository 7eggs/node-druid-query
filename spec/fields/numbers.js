'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#threshold()', function() {
    it('should set value', function() {
      var raw = query.threshold(1).toJSON()

      expect(raw.threshold).to.be(1)
      expect(raw.threshold).to.be.a('number')
    })

    it('should parse string and set value', function() {
      var raw = query.threshold('1').toJSON()

      expect(raw.threshold).to.be(1)
      expect(raw.threshold).to.be.a('number')
    })

    it('should parse float and set value', function() {
      var raw = query.threshold('1.5').toJSON()

      expect(raw.threshold).to.be(1.5)
      expect(raw.threshold).to.be.a('number')
    })

    it('should throw error when can\'t parse number', function() {
      expect(function() {
        query.threshold('NaN')
      }).to.throwException()
    })
  })
})