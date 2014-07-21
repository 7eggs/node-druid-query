'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('.filter()', function() {
    it('should create filter', function() {
      var spec = Query.filter('selector', 'dim', 'value')

      expect(spec).to.eql({
        type:      'selector',
        dimension: 'dim',
        value:     'value'
      })
    })
    it('should create filter using raw object', function() {
      var spec = Query.filter({type: 'selector', dimension: 'dim', value: 'value'})

      expect(spec).to.eql({
        type:      'selector',
        dimension: 'dim',
        value:     'value'
      })
    })

    it('should throw error if bad filter type specified', function() {
      expect(function() {
        Query.filter('bad_type')
      }).to.throwException()
    })
  })

  describe('#filter()', function() {
    it('should set filter', function() {
      var raw = query.filter('and', [
        Query.filter('selector', 'sample_dimension1', 'sample_value1'),
        Query.filter('or', [
          Query.filter('selector', 'sample_dimension2', 'sample_value2'),
          Query.filter('selector', 'sample_dimension3', 'sample_value3')
        ])
      ]).toJSON()

      expect(raw.filter).to.eql({
        type:   'and',
        fields: [
          { type: 'selector', dimension: 'sample_dimension1', value: 'sample_value1' },
          { type:   'or',
            fields: [
              { type: 'selector', dimension: 'sample_dimension2', value: 'sample_value2' },
              { type: 'selector', dimension: 'sample_dimension3', value: 'sample_value3' }
            ]
          }
        ]
      })
    })
  })
})
