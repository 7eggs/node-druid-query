'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('.query()', function() {
    it('should create SearchQuerySpec', function() {
      var spec = Query.query('insensitive_contains', 'some_value')

      expect(spec).to.eql({
        type:  'insensitive_contains',
        value: 'some_value'
      })
    })
  })

  describe('#query()', function() {
    it('should set InsensitiveContainsSearchQuerySpec', function() {
      var raw = query.query('insensitive_contains', 'some_value').toJSON()

      expect(raw.query).to.eql({
        type:  'insensitive_contains',
        value: 'some_value'
      })
    })

    it('should set FragmentSearchQuerySpec using argument', function() {
      var raw = query.query('fragment', ['fragment1', 'fragment2']).toJSON()

      expect(raw.query).to.eql({
        type:   'fragment',
        values: ['fragment1', 'fragment2'],
        caseSensitive: false
      })
    })

    it('should throw error if type is not specified', function() {
      expect(function() {
        query.query(null)
      }).to.throwException()
    })

    it('should throw error if bad type is specified', function() {
      expect(function() {
        query.query('bad_type')
      }).to.throwException()
    })

    it('should throw error if value is not specified', function() {
      expect(function() {
        query.query('insensitive_contains')
      }).to.throwException()
    })
  })
})