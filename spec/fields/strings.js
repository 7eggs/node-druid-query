'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#dataSource()', function() {
    it('should set value', function() {
      var raw = query.dataSource('sample_datasource').toJSON()

      expect(raw.dataSource).to.be('sample_datasource')
      expect(raw.dataSource).to.be.a('string')
    })

    it('should convert any input value to string', function() {
      var raw = query.dataSource(new String('sample_datasource')).toJSON()

      expect(raw.dataSource).to.be('sample_datasource')
      expect(raw.dataSource).to.be.a('string')
    })
  })

  describe('#queryType()', function() {
    it('should set value', function() {
      var raw = query.queryType('groupBy').toJSON()

      expect(raw.queryType).to.be('groupBy')
      expect(raw.queryType).to.be.a('string')
    })

    it('should convert any input value to string', function() {
      var raw = query.queryType(new String('groupBy')).toJSON()

      expect(raw.queryType).to.be('groupBy')
      expect(raw.queryType).to.be.a('string')
    })
  })
})