'use strict'

var expect = require('expect.js')
  , DimExtractionFn = require('./query').extractionFunction


describe('DimExtractionFn (Query.extractionFunction)', function() {
  it('show create spec using raw object', function() {
    var spec = DimExtractionFn({type: 'regex', expr: 'ab*'})

    expect(spec).to.eql({
      type: 'regex',
      expr: 'ab*'
    })
  })

  it('show throw error if bad DimExtractionFn type is specified', function() {
    expect(function() {
      DimExtractionFn('bad_type')
    }).to.throwException()
  })

  describe('RegexDimExtractionFn', function() {
    it('should create spec', function() {
      var spec = DimExtractionFn('regex', 'ab*')

      expect(spec).to.eql({type: 'regex', expr: 'ab*'})
    })

    it('should throw error if regular expression is not set', function() {
      expect(function() {
        DimExtractionFn('regex')
      }).to.throwException()
    })
  })

  describe('PartialDimExtractionFn', function() {
    it('should create spec', function() {
      var spec = DimExtractionFn('partial', 'ab*')

      expect(spec).to.eql({type: 'partial', expr: 'ab*'})
    })

    it('should throw error if regular expression is not set', function() {
      expect(function() {
        DimExtractionFn('partial')
      }).to.throwException()
    })
  })

  describe('SearchQuerySpecDimExtractionFn', function() {
    it('should create spec with raw SearchQuerySpec object', function() {
      var spec = DimExtractionFn('searchQuery', {type: 'insensitive_contains', value: 'abc'})

      expect(spec).to.eql({type: 'searchQuery', query: {type: 'insensitive_contains', value: 'abc'}})
    })

    it('should create spec using Query.query()', function() {
      var spec = DimExtractionFn('searchQuery', 'insensitive_contains', 'abc')

      expect(spec).to.eql({type: 'searchQuery', query: {type: 'insensitive_contains', value: 'abc'}})
    })

    it('should throw error if bad SearchQuerySpec type specified', function() {
      expect(function() {
        DimExtractionFn('searchQuery')
      }).to.throwException()
    })

    it('should throw error if bad SearchQuerySpec type specified #2', function() {
      expect(function() {
        DimExtractionFn('searchQuery', 'bad_type')
      }).to.throwException()
    })
  })

  describe('TimeDimExtractionFn', function() {
    it('should create spec', function() {
      var spec = DimExtractionFn('time', 'yyyy.MM.dd h:mm a', 'h:mm a')

      expect(spec).to.eql({type: 'time', timeFormat: 'yyyy.MM.dd h:mm a', resultFormat: 'h:mm a'})
    })

    it('should throw error if input time format not specified', function() {
      expect(function() {
        DimExtractionFn('time', null, 'h:mm a')
      }).to.throwException()
    })

    it('should throw error if output time format not specified', function() {
      expect(function() {
        DimExtractionFn('searchQuery', 'yyyy.MM.dd h:mm a')
      }).to.throwException()
    })
  })
})
