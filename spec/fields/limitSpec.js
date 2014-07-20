'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#limitSpec()', function() {
    it('should set limitSpec', function() {
      var raw = query.limitSpec('default', 100, ['dim1', 'metric1']).toJSON()

      expect(raw.limitSpec).to.eql({
        type:    'default',
        limit:   100,
        columns: ['dim1', 'metric1']
      })
    })

    it('should set limitSpec using raw object', function() {
      var raw = query.limitSpec({type: 'default', limit: 100, columns: ['dim1', 'metric1']}).toJSON()

      expect(raw.limitSpec).to.eql({
        type:    'default',
        limit:   100,
        columns: ['dim1', 'metric1']
      })
    })

    it('should convert limit to number', function() {
      var raw = query.limitSpec('default', '100', ['dim1', 'metric1']).toJSON()

      expect(raw.limitSpec).to.eql({
        type:    'default',
        limit:   100,
        columns: ['dim1', 'metric1']
      })
    })

    it('should throw error if bad type specified', function() {
      expect(function() {
        query.limitSpec('missing type')
      }).to.throwException()
    })

    it('should throw error if bad limit specified', function() {
      expect(function() {
        query.limitSpec('default', false)
      }).to.throwException()
    })

    it('should throw error if columns are not specified', function() {
      expect(function() {
        query.limitSpec('default', 100)
      }).to.throwException()
    })
  })
})