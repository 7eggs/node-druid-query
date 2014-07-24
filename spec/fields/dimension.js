'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#dimension()', function() {
    it('should create default DimensionSpec', function() {
      var raw = query.dimension('dim').toJSON()

      expect(raw.dimension).to.be.a('object')
      expect(raw.dimension).to.eql({type: 'default', dimension: 'dim'})
    })

    it('should create default DimensionSpec with output name', function() {
      var raw = query.dimension('dim', 'output').toJSON()

      expect(raw.dimension).to.be.a('object')
      expect(raw.dimension).to.eql({type: 'default', dimension: 'dim', outputName: 'output'})
    })

    it('should create ExtractionDimensionSpec', function() {
      var raw = query.dimension('dim', {type: 'regex', expr: 'abc'}).toJSON()

      expect(raw.dimension).to.be.a('object')
      expect(raw.dimension).to.eql({type: 'extraction', dimension: 'dim', dimExtractionFn: {type: 'regex', expr: 'abc'}})
    })

    it('should create ExtractionDimensionSpec with outputName', function() {
      var raw = query.dimension('dim', 'output', {type: 'regex', expr: 'abc'}).toJSON()

      expect(raw.dimension).to.be.a('object')
      expect(raw.dimension).to.eql({type: 'extraction', dimension: 'dim', outputName: 'output', dimExtractionFn: {type: 'regex', expr: 'abc'}})
    })

    it('should throw error if dimension is not set', function() {
      expect(function() {
        query.dimension(null)
      }).to.throwException()
    })

    it('should throw error if arguments number is invalid', function() {
      expect(function() {
        query.dimension('a', 'b', 'c', 'd')
      }).to.throwException()
    })
  })
})
