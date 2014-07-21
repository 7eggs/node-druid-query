'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  describe('.aggregation()', function() {
    it('should create spec', function() {
      var spec = Query.aggregation('count', 'output')

      expect(spec.type).to.be('count')
      expect(spec.name).to.be('output')
    })

    it('should create spec using raw object', function() {
      var spec = Query.aggregation({type: 'count', name: 'output'})

      expect(spec.type).to.be('count')
      expect(spec.name).to.be('output')
    })

    it('should throw error for missing type', function() {
      expect(function() {
        Query.aggregation('missing', 'aggregation')
      }).to.throwException()
    })

    it('should throw error for missing name', function() {
      expect(function() {
        Query.aggregation('count')
      }).to.throwException()
    })
  })

  describe('#aggregation()', function() {
    var query

    beforeEach(function() {
      query = new Query()
    })

    it('should add spec to aggregations', function() {
      query.aggregation('count', 'output')
      var raw = query.toJSON()

      expect(raw.aggregations).to.have.length(1)
      expect(raw.aggregations[0].type).to.be('count')
      expect(raw.aggregations[0].name).to.be('output')
    })

    it('should add raw spec to aggregations', function() {
      query.aggregation({type: 'count', name: 'output'})
      var raw = query.toJSON()

      expect(raw.aggregations).to.be.an(Array)
      expect(raw.aggregations).to.have.length(1)
      expect(raw.aggregations[0].type).to.be('count')
      expect(raw.aggregations[0].name).to.be('output')
    })
  })
})
