'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Post-Aggregations', function() {
  describe('Arithmetic post-aggregator', function() {
    it('should create spec', function() {
      var spec = Query.postAggregation('arithmetic', 'paValue1', '*', {
        type:      'fieldAccess',
        fieldName: 'aggregator1'
      }, {
        type:      'fieldAccess',
        fieldName: 'aggregator2'
      })

      expect(spec).to.eql({
        type:   'arithmetic',
        name:   'paValue1',
        fn:     '*',
        fields: [
          {
            type:      'fieldAccess',
            fieldName: 'aggregator1'
          },

          {
            type:      'fieldAccess',
            fieldName: 'aggregator2'
          }
        ]
      })
    })

    it('should throw error if arithmetic function is not specified', function() {
      expect(function() {
        Query.postAggregation('arithmetic', 'paValue2')
      }).to.throwException()
    })

    it('should throw error if fields are not specified', function() {
      expect(function() {
        Query.postAggregation('arithmetic', 'paValue3', '*')
      }).to.throwException()
    })
  })

  describe('Field accessor post-aggregator', function() {
    it('should create spec', function() {
      var spec = Query.postAggregation('fieldAccess', 'paValue4', 'aggregator3')

      expect(spec).to.eql({
        type:      'fieldAccess',
        name:      'paValue4',
        fieldName: 'aggregator3'
      })
    })

    it('should create w/o name', function() {
      var spec = Query.postAggregation('fieldAccess', 'aggregator4')

      expect(spec).to.eql({
        type:      'fieldAccess',
        fieldName: 'aggregator4'
      })
    })

    it('should throw error if fieldName is not specified', function() {
      expect(function() {
        Query.postAggregation('fieldAccess', 'paValue5', null)
      }).to.throwException()
    })
  })

  describe('Constant post-aggregator', function() {
    it('should create spec', function() {
      var spec = Query.postAggregation('constant', 'paValue6', 100)

      expect(spec).to.eql({
        type:  'constant',
        name:  'paValue6',
        value: 100
      })
    })

    it('should throw error if value is not specified', function() {
      expect(function() {
        Query.postAggregation('fieldAccess', 'paValue7', null)
      }).to.throwException()
    })
  })

  describe('JavaScript post-aggregator', function() {
    it('should create spec', function() {
      var spec = Query.postAggregation('javascript', 'paValue8', ['count', 'price'], function total(count, price) { return count * price })

      expect(spec).to.eql({
        type:       'javascript',
        name:       'paValue8',
        fieldNames: ['count', 'price'],
        function:   'function total(count, price) { return count * price }'
      })
    })

    it('should throw error if fieldNames are not specified', function() {
      expect(function() {
        Query.postAggregation('javascript', 'paValue9', null)
      }).to.throwException()
    })

    it('should throw error if fieldNames are empty', function() {
      expect(function() {
        Query.postAggregation('javascript', 'paValue10', [])
      }).to.throwException()
    })

    it('should throw error if function is not specified', function() {
      expect(function() {
        Query.postAggregation('javascript', 'paValue11', ['aggregator5', 'aggregator6'])
      }).to.throwException()
    })
  })

  describe('hyperUniqueCardinality post-aggregator', function() {
    it('should create spec', function() {
      var spec = Query.postAggregation('hyperUniqueCardinality', 'paValue12', 'aggregator7')

      expect(spec).to.eql({
        type:      'hyperUniqueCardinality',
        name:      'paValue12',
        fieldName: 'aggregator7'
      })
    })

    it('should create w/o name', function() {
      var spec = Query.postAggregation('hyperUniqueCardinality', 'aggregator8')

      expect(spec).to.eql({
        type:      'hyperUniqueCardinality',
        fieldName: 'aggregator8'
      })
    })

    it('should throw error if fieldName is not specified', function() {
      expect(function() {
        Query.postAggregation('hyperUniqueCardinality', 'paValue13', null)
      }).to.throwException()
    })
  })
})
