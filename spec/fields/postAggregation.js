'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  describe('.postAggregation()', function() {
    it('should create spec', function() {
      var spec = Query.postAggregation('arithmetic', 'output', '/', [
        Query.postAggregation('fieldAccess', 'aggregator1'),
        Query.postAggregation('fieldAccess', 'aggregator2')
      ])

      expect(spec).to.eql({
        type:   'arithmetic',
        name:   'output',
        fn:     '/',
        fields: [
          {type: 'fieldAccess', fieldName: 'aggregator1'},
          {type: 'fieldAccess', fieldName: 'aggregator2'}
        ]
      })
    })

    it('should create spec using raw object', function() {
      var spec = Query.postAggregation({
        type:      'fieldAccess',
        fieldName: 'aggregator3'
      })

      expect(spec).to.eql({
        type:      'fieldAccess',
        fieldName: 'aggregator3'
      })
    })

    it('should throw error for missing type', function() {
      expect(function() {
        Query.postAggregation('missing')
      }).to.throwException()
    })

    it('should throw error for missing name', function() {
      expect(function() {
        Query.aggregation('arithmetic')
      }).to.throwException()
    })
  })

  describe('#postAggregation()', function() {
    var query

    beforeEach(function() {
      query = new Query()
    })

    it('should add spec to postAggregations', function() {
      var raw = query.postAggregation('hyperUniqueCardinality', 'huAggregator').toJSON()

      expect(raw.postAggregations).to.be.an(Array)
      expect(raw.postAggregations).to.have.length(1)
      expect(raw.postAggregations[0]).to.eql({
        type:      'hyperUniqueCardinality',
        fieldName: 'huAggregator'
      })
    })

    it('should raw spec to postAggregations', function() {
      var raw = query.postAggregation({type: 'hyperUniqueCardinality', fieldName: 'huAggregator'}).toJSON()

      expect(raw.postAggregations).to.be.an(Array)
      expect(raw.postAggregations).to.have.length(1)
      expect(raw.postAggregations[0]).to.eql({
        type:      'hyperUniqueCardinality',
        fieldName: 'huAggregator'
      })
    })
  })
})
