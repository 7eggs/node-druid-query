'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('.having()', function() {
    it('should create filter', function() {
      var spec = Query.having('equalTo', 'number', 100500)

      expect(spec).to.eql({
        type:        'equalTo',
        aggregation: 'number',
        value:       100500
      })
    })

    it('should create filter using raw object', function() {
      var spec = Query.having({type: 'equalTo', aggregation: 'number', value: 100500})

      expect(spec).to.eql({
        type:        'equalTo',
        aggregation: 'number',
        value:       100500
      })
    })

    it('should throw error if bad filter type specified', function() {
      expect(function() {
        Query.having('bad_type')
      }).to.throwException()
    })
  })

  describe('#having()', function() {
    it('should set filter', function() {
      var raw = query.having('lessThan', 'number', 100500).toJSON()

      expect(raw.having).to.eql({
        type:        'lessThan',
        aggregation: 'number',
        value:       100500
      })
    })
  })
})


describe('Having', function() {
  describe('Equal To', function() {
    it('should create filter', function() {
      var spec = Query.having('equalTo', 'aggregation1', 1234)

      expect(spec).to.eql({
        type:        'equalTo',
        aggregation: 'aggregation1',
        value:       1234
      })
    })

    it('should create filter #2', function() {
      var spec = Query.having('greaterThan', 'aggregation1', '1234')

      expect(spec).to.eql({
        type:        'greaterThan',
        aggregation: 'aggregation1',
        value:       1234
      })
    })

    it('should throw error aggregation not specified', function() {
      expect(function() {
        Query.having('lessThan', null, 100)
      }).to.throwException()
    })

    it('should throw error invalid number value specified', function() {
      expect(function() {
        Query.having('equalTo', null, true)
      }).to.throwException()
    })
  })

  describe('Greater Than', function() {
    it('should create filter', function() {
      var spec = Query.having('greaterThan', 'aggregation1', 1234)

      expect(spec).to.eql({
        type:        'greaterThan',
        aggregation: 'aggregation1',
        value:       1234
      })
    })

    it('should create filter #2', function() {
      var spec = Query.having('greaterThan', 'aggregation1', '1234')

      expect(spec).to.eql({
        type:        'greaterThan',
        aggregation: 'aggregation1',
        value:       1234
      })
    })

    it('should throw error aggregation not specified', function() {
      expect(function() {
        Query.having('lessThan', null, 100)
      }).to.throwException()
    })

    it('should throw error invalid number value specified', function() {
      expect(function() {
        Query.having('greaterThan', null, true)
      }).to.throwException()
    })
  })

  describe('Less Than', function() {
    it('should create filter', function() {
      var spec = Query.having('lessThan', 'aggregation1', 1234)

      expect(spec).to.eql({
        type:        'lessThan',
        aggregation: 'aggregation1',
        value:       1234
      })
    })

    it('should create filter #2', function() {
      var spec = Query.having('greaterThan', 'aggregation1', '1234')

      expect(spec).to.eql({
        type:        'greaterThan',
        aggregation: 'aggregation1',
        value:       1234
      })
    })

    it('should throw error aggregation not specified', function() {
      expect(function() {
        Query.having('lessThan', null, 100)
      }).to.throwException()
    })

    it('should throw error invalid number value specified', function() {
      expect(function() {
        Query.having('lessThan', null, true)
      }).to.throwException()
    })
  })

  describe('Logical AND', function() {
    it('should create filter using array argument', function() {
      var spec = Query.having('and', [
        Query.having('greaterThan', 'aggregation1', 0),
        Query.having('lessThan', 'aggregation1', 10)
      ])

      expect(spec).to.eql({
        type:        'and',
        havingSpecs: [
          {type: 'greaterThan', aggregation: 'aggregation1', value: 0},
          {type: 'lessThan', aggregation: 'aggregation1', value: 10}
        ]
      })
    })

    it('should create filter using each argument as spec', function() {
      var spec = Query.having('and', Query.having('greaterThan', 'aggregation1', 0), Query.having('lessThan', 'aggregation1', 10))

      expect(spec).to.eql({
        type:        'and',
        havingSpecs: [
          {type: 'greaterThan', aggregation: 'aggregation1', value: 0},
          {type: 'lessThan', aggregation: 'aggregation1', value: 10}
        ]
      })
    })

    it('should throw error if no specs specified', function() {
      expect(function() {
        Query.having('and')
      }).to.throwException()
    })
  })

  describe('Logical OR', function() {
    it('should create filter using array argument', function() {
      var spec = Query.having('or', [
        Query.having('greaterThan', 'aggregation1', 0),
        Query.having('lessThan', 'aggregation1', 10)
      ])

      expect(spec).to.eql({
        type:        'or',
        havingSpecs: [
          {type: 'greaterThan', aggregation: 'aggregation1', value: 0},
          {type: 'lessThan', aggregation: 'aggregation1', value: 10}
        ]
      })
    })

    it('should create filter using each argument as spec', function() {
      var spec = Query.having('or', Query.having('greaterThan', 'aggregation1', 0), Query.having('lessThan', 'aggregation1', 10))

      expect(spec).to.eql({
        type:        'or',
        havingSpecs: [
          {type: 'greaterThan', aggregation: 'aggregation1', value: 0},
          {type: 'lessThan', aggregation: 'aggregation1', value: 10}
        ]
      })
    })

    it('should throw error if no specs specified', function() {
      expect(function() {
        Query.having('ors')
      }).to.throwException()
    })
  })

  describe('Logical NOT', function() {
    it('should create filter using filter spec', function() {
      var spec = Query.having('not', Query.having('equalTo', 'aggregation1', 10))

      expect(spec).to.eql({
        type:       'not',
        havingSpec: {
          type:        'equalTo',
          aggregation: 'aggregation1',
          value:       10
        }
      })
    })

    it('should create filter passing arguments to Query.filter()', function() {
      var spec = Query.having('not', 'equalTo', 'aggregation1', 10)

      expect(spec).to.eql({
        type:       'not',
        havingSpec: {
          type:        'equalTo',
          aggregation: 'aggregation1',
          value:       10
        }
      })
    })

    it('should throw error if spec is not specified', function() {
      expect(function() {
        query.having('not')
      }).to.throwException()
    })
  })
})
