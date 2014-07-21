'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Filters', function() {
  describe('Selector', function() {
    it('should create filter', function() {
      var spec = Query.filter('selector', 'dim', 'value')

      expect(spec).to.eql({
        type:      'selector',
        dimension: 'dim',
        value:     'value'
      })
    })

    it('should throw error if dimension is not specified', function() {
      expect(function() {
        Query.filter('selector', null, 'value')
      }).to.throwException()
    })

    it('should throw error if value is not specified', function() {
      expect(function() {
        Query.filter('selector', 'dimension')
      }).to.throwException()
    })
  })

  describe('Regular expression', function() {
    it('should create filter', function() {
      var spec = Query.filter('regex', 'dimension', 'ab*')

      expect(spec).to.eql({
        type:      'regex',
        dimension: 'dimension',
        pattern:   'ab*'
      })
    })

    it('should throw error if dimension is not specified', function() {
      expect(function() {
        Query.filter('regex', null, 'ab*')
      }).to.throwException()
    })

    it('should throw error if pattern is not specified', function() {
      expect(function() {
        Query.filter('regex', 'dimension')
      }).to.throwException()
    })
  })

  describe('Logical AND', function() {
    it('should create filter using array argument', function() {
      var spec = Query.filter('and', [
        Query.filter('selector', 'dim1', 'value1'),
        Query.filter('selector', 'dim2', 'value2')
      ])

      expect(spec).to.eql({
        type:   'and',
        fields: [
          {type: 'selector', dimension: 'dim1', value: 'value1'},
          {type: 'selector', dimension: 'dim2', value: 'value2'}
        ]
      })
    })

    it('should create filter using each argument as filter', function() {
      var spec = Query.filter('and',
        Query.filter('selector', 'dim3', 'value3'),
        Query.filter('selector', 'dim4', 'value4')
      )

      expect(spec).to.eql({
        type:   'and',
        fields: [
          {type: 'selector', dimension: 'dim3', value: 'value3'},
          {type: 'selector', dimension: 'dim4', value: 'value4'}
        ]
      })
    })

    it('should throw error if no filters specified', function() {
      expect(function() {
        Query.filter('and')
      }).to.throwException()
    })
  })

  describe('Logical OR', function() {
    it('should create filter using array argument', function() {
      var spec = Query.filter('or', [
        Query.filter('selector', 'dim1', 'value1'),
        Query.filter('selector', 'dim2', 'value2')
      ])

      expect(spec).to.eql({
        type:   'or',
        fields: [
          {type: 'selector', dimension: 'dim1', value: 'value1'},
          {type: 'selector', dimension: 'dim2', value: 'value2'}
        ]
      })
    })

    it('should create filter using each argument as filter', function() {
      var spec = Query.filter('or',
        Query.filter('selector', 'dim3', 'value3'),
        Query.filter('selector', 'dim4', 'value4')
      )

      expect(spec).to.eql({
        type:   'or',
        fields: [
          {type: 'selector', dimension: 'dim3', value: 'value3'},
          {type: 'selector', dimension: 'dim4', value: 'value4'}
        ]
      })
    })

    it('should throw error if no filters specified', function() {
      expect(function() {
        Query.filter('and')
      }).to.throwException()
    })
  })

  describe('Logical NOT', function() {
    it('should create filter using filter spec', function() {
      var spec = Query.filter('not', Query.filter('selector', 'dim1', 'value1'))

      expect(spec).to.eql({
        type:  'not',
        field: {
          type:      'selector',
          dimension: 'dim1',
          value:     'value1'
        }
      })
    })

    it('should create filter passing arguments to Query.filter()', function() {
      var spec = Query.filter('not', 'regex', 'dimension', 'ab*')

      expect(spec).to.eql({
        type:  'not',
        field: {
          type:      'regex',
          dimension: 'dimension',
          pattern:   'ab*'
        }
      })
    })

    it('should throw error if filter is not specified', function() {
      expect(function() {
        Query.filter('not')
      }).to.throwException()
    })
  })

  describe('JavaScript', function() {
    it('should create filter', function() {
      var spec = Query.filter('javascript', 'dimension', function(value) { return value === 'event' })

      expect(spec).to.eql({
        type:      'javascript',
        dimension: 'dimension',
        function:  'function (value) { return value === \'event\' }'
      })
    })

    it('should throw error if dimension is not specified', function() {
      expect(function() {
        Query.filter('javascript', null, function(value) { return value === 'event' })
      }).to.throwException()
    })

    it('should throw error if function is not specified', function() {
      expect(function() {
        Query.filter('javascript', 'dimension', null)
      }).to.throwException()
    })
  })
})
