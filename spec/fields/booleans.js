'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#merge()', function() {
    it('should set value (boolean)', function() {
      var raw = query.merge(true).toJSON()

      expect(raw.merge).to.be(true)
    })

    it('should set value (string)', function() {
      var raw = query.merge('yes').toJSON()

      expect(raw.merge).to.be(true)
    })

    it('should set value (number)', function() {
      var raw = query.merge(0).toJSON()

      expect(raw.merge).to.be(false)
    })

    it('should set value (Boolean)', function() {
      var raw = query.merge(new Boolean(false)).toJSON()

      expect(raw.merge).to.be(false)
    })
  })
})