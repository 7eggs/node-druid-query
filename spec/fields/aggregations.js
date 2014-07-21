'use strict'

var expect = require('expect.js')
  , Query = require('./query')

var noop = function() {
}


describe('Aggregations', function() {
  describe('count', function() {
    it('should create spec', function() {
      var spec = Query.aggregation('count', 'count_field')

      expect(spec.type).to.be('count')
      expect(spec.name).to.be('count_field')
    })
  })

  describe('longSum', function() {
    it('should create spec', function() {
      var spec = Query.aggregation('longSum', 'output', 'input')

      expect(spec.type).to.be('longSum')
      expect(spec.name).to.be('output')
      expect(spec.fieldName).to.be('input')
    })

    it('should throw error when metric is not specified', function() {
      expect(function() {
        Query.aggregation('longSum', 'output')
      }).to.throwException()
    })
  })

  describe('doubleSum', function() {
    it('should create spec', function() {
      var spec = Query.aggregation('doubleSum', 'output', 'input')

      expect(spec.type).to.be('doubleSum')
      expect(spec.name).to.be('output')
      expect(spec.fieldName).to.be('input')
    })

    it('should throw error when metric is not specified', function() {
      expect(function() {
        Query.aggregation('doubleSum', 'output')
      }).to.throwException()
    })
  })

  describe('max', function() {
    it('should create spec', function() {
      var spec = Query.aggregation('max', 'output', 'input')

      expect(spec.type).to.be('max')
      expect(spec.name).to.be('output')
      expect(spec.fieldName).to.be('input')
    })

    it('should throw error when metric is not specified', function() {
      expect(function() {
        Query.aggregation('max', 'output')
      }).to.throwException()
    })
  })

  describe('min', function() {
    it('should create spec', function() {
      var spec = Query.aggregation('min', 'output', 'input')

      expect(spec.type).to.be('min')
      expect(spec.name).to.be('output')
      expect(spec.fieldName).to.be('input')
    })

    it('should throw error when metric is not specified', function() {
      expect(function() {
        Query.aggregation('min', 'output')
      }).to.throwException()
    })
  })

  describe('javascript', function() {
    it('should create spec', function() {
      var spec = Query.aggregation('javascript', 'output', ['a', 'b'], noop, noop, noop)

      expect(spec.type).to.be('javascript')
      expect(spec.name).to.be('output')
      expect(spec.aggregateFn).to.be.a('string')
      expect(spec.combineFn).to.be.a('string')
      expect(spec.resetFn).to.be.a('string')
    })

    it('should throw error when field names array is empty', function() {
      expect(function() {
        Query.aggregation('javascript', 'output', [], noop, noop, noop)
      }).to.throwException()

      expect(function() {
        Query.aggregation('javascript', 'output', null, noop, noop, noop)
      }).to.throwException()
    })

    it('should throw error when any of functions is missing', function() {
      expect(function() {
        Query.aggregation('javascript', 'output', [], null, noop, noop)
      }).to.throwException()

      expect(function() {
        Query.aggregation('javascript', 'output', [], noop, null, noop)
      }).to.throwException()

      expect(function() {
        Query.aggregation('javascript', 'output', [], noop, noop, null)
      }).to.throwException()
    })
  })

  describe('cardinality', function() {
    it('should create spec', function() {
      var spec = Query.aggregation('cardinality', 'output', ['a', 'b'], true)

      expect(spec.type).to.be('cardinality')
      expect(spec.name).to.be('output')
      expect(spec.fieldNames).to.eql(['a', 'b'])
      expect(spec.byRow).to.be(true)
    })

    it('should throw error when field names are not specified', function() {
      expect(function() {
        Query.aggregation('cardinality', 'output', null)
      }).to.throwException()

      expect(function() {
        Query.aggregation('cardinality', 'output', [])
      }).to.throwException()
    })
  })

  describe('hyperUnique', function() {
    it('should create spec', function() {
      var spec = Query.aggregation('hyperUnique', 'output', 'input')

      expect(spec.type).to.be('hyperUnique')
      expect(spec.name).to.be('output')
      expect(spec.fieldName).to.be('input')
    })

    it('should throw error when dimension is not specified', function() {
      expect(function() {
        Query.aggregation('hyperUnique', 'output')
      }).to.throwException()
    })
  })
})