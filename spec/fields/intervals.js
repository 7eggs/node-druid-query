'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#intervals()', function() {
    it('should set intervals using two dates', function() {
      var raw = query.intervals(new Date('2010-01-01T00:00:00.000Z'), new Date('2011-01-01T00:00:00.000Z')).toJSON()

      expect(raw.intervals).to.eql([
        '2010-01-01T00:00:00.000Z/2011-01-01T00:00:00.000Z'
      ])
    })

    it('should set intervals using interval arrays ([start, end])', function() {
      var raw = query.intervals([0, 3600000], [7200000, 10800000]).toJSON()

      expect(raw.intervals).to.eql([
        '1970-01-01T00:00:00.000Z/1970-01-01T01:00:00.000Z',
        '1970-01-01T02:00:00.000Z/1970-01-01T03:00:00.000Z'
      ])
    })

    it('should throw error if interval is not specified', function() {
      expect(function() {
        query.intervals(null)
      }).to.throwException()
    })

    it('should throw error if bad date specified', function() {
      expect(function() {
        query.intervals(false, true)
      }).to.throwException()
    })
  })
})