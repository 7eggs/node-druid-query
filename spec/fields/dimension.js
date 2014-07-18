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
      var raw = query.dimension('dim', null, {type: 'regex', expr: 'abc'}).toJSON()

      expect(raw.dimension).to.be.a('object')
      expect(raw.dimension).to.eql({type: 'extraction', dimension: 'dim', outputName: null, dimExtractionFn: {type: 'regex', expr: 'abc'}})
    })

    it('should throw error if priority is not int', function() {
      expect(function() {
        query.dimension()
      }).to.throwException()
    })
  })
})
