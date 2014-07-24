'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {


  describe('.interval()', function() {
    it('should create interval using string', function() {
      var value = Query.interval('2000-01-01/2015-01-01')

      expect(value).to.be('2000-01-01/2015-01-01')
    })

    it('should create interval using pair of timestamps', function() {
      var value = Query.interval(Date.UTC(2010, 0, 1), Date.UTC(2012, 0, 1))

      expect(value).to.be('2010-01-01T00:00:00.000Z/2012-01-01T00:00:00.000Z')
    })

    it('should create interval using pair of date strings', function() {
      var value = Query.interval('2010-01-01T00:00:00.000Z', '2011-01-01T00:00:00.000Z')

      expect(value).to.be('2010-01-01T00:00:00.000Z/2011-01-01T00:00:00.000Z')
    })

    it('should create interval using pair of dates', function() {
      var value = Query.interval(new Date('2010-01-01T00:00:00.000Z'), new Date('2011-01-01T00:00:00.000Z'))

      expect(value).to.be('2010-01-01T00:00:00.000Z/2011-01-01T00:00:00.000Z')
    })

    it('should throw error if wrong arguments are specified', function() {
      expect(function() {
        Query.interval(null)
      })
    })

    it('should throw error if wrong arguments are specified #2', function() {
      expect(function() {
        Query.interval(false, true)
      })
    })
  })

  describe('#intervals()', function() {
    var query

    beforeEach(function() {
      query = new Query()
    })

    it('should set interval using string', function() {
      var value = query.interval('2000-01-01/2015-01-01').intervals()[0]

      expect(value).to.be('2000-01-01/2015-01-01')
    })

    it('should set interval using pair of dates', function() {
      var value = query.interval(Date.UTC(2010, 0, 1), Date.UTC(2012, 0, 1)).intervals()[0]

      expect(value).to.be('2010-01-01T00:00:00.000Z/2012-01-01T00:00:00.000Z')
    })
  })
})