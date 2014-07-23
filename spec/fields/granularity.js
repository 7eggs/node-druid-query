'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#granularity()', function() {
    it('should set granularity as string', function() {
      var raw = query.granularity('day').toJSON()

      expect(raw.granularity).to.be('day')
    })

    it('should throw error if bad filter type specified', function() {
      expect(function() {
        query.granularity('bad_granularity')
      }).to.throwException()
    })

    describe('Duration', function() {
      it('should set spec', function() {
        var raw = query.granularity('duration', 3600000).toJSON()

        expect(raw.granularity).to.eql({
          type:     'duration',
          duration: '3600000'
        })
      })

      it('should set spec with origin as number', function() {
        var raw = query.granularity('duration', 3600000, 1234567890000).toJSON()

        expect(raw.granularity).to.eql({
          type:     'duration',
          duration: '3600000',
          origin:   new Date(1234567890000)
        })
      })

      it('should set spec with origin as string', function() {
        var raw = query.granularity('duration', 3600000, '2014-07-20T21:01:08.536Z').toJSON()

        expect(raw.granularity).to.eql({
          type:     'duration',
          duration: '3600000',
          origin:   new Date('2014-07-20T21:01:08.536Z')
        })
      })

      it('should set spec with origin as Date', function() {
        var now = new Date()
          , raw = query.granularity('duration', 3600000, now).toJSON()

        expect(raw.granularity).to.eql({
          type:     'duration',
          duration: '3600000',
          origin:   now
        })
      })

      it('should throw error if invalid duration specified', function() {
        expect(function() {
          query.granularity('duration')
        }).to.throwException()
      })

      it('should throw error if invalid date specified', function() {
        expect(function() {
          query.granularity('duration', 3600000, true)
        }).to.throwException()
      })
    })

    describe('Period', function() {
      it('should set spec', function() {
        var raw = query.granularity('period', 'PT1M').toJSON()

        expect(raw.granularity).to.eql({
          type:   'period',
          period: 'PT1M'
        })
      })

      it('should set spec with timezone & origin', function() {
        var raw = query.granularity('period', 'P2D', 'UTC', 1234567890000).toJSON()

        expect(raw.granularity).to.eql({
          type:     'period',
          period:   'P2D',
          timeZone: 'UTC',
          origin:   new Date(1234567890000)
        })
      })

      it('should throw error if invalid period specified (not ISO-8601 duration)', function() {
        expect(function() {
          query.granularity('period', 'PTZ')
        }).to.throwException()
      })

      it('should throw error if invalid origin specified ', function() {
        expect(function() {
          query.granularity('period', 'PT1H', 'UTC', true)
        }).to.throwException()
      })
    })
  })
})
