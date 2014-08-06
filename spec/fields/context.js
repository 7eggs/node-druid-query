'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#context()', function() {
    it('should create empty object if nothing specified', function() {
      var raw = query.context(null).context()

      expect(raw).to.be.empty()
    })

    it('should create spec', function() {
      var raw = query.context({priority: 100500, bySegment: true}).context()

      expect(raw).to.eql({priority: 100500, bySegment: true})
    })

    it('should convert priority to int', function() {
      var raw = query.context({priority: '100500'}).context()

      expect(raw.priority).to.be(100500)
    })

    it('should convert timeout to int', function() {
      var raw = query.context({timeout: '100500'}).context()

      expect(raw.timeout).to.be(100500)
    })

    it('should convert queryId to string', function() {
      var raw = query.context({queryId: 100500}).context()

      expect(raw.queryId).to.be('100500')
    })

    it('should throw error if priority is not int', function() {
      expect(function() {
        query.context({priority: 'NaN'})
      }).to.throwException()
    })

    it('should convert bySegment, populateCache, useCache, finalize to boolean', function() {
      var raw = query.context({bySegment: 'yes, sir!', populateCache: 0, useCache: new Boolean(false), finalize: 'no'}).context()

      expect(raw.bySegment).to.be(true)
      expect(raw.populateCache).to.be(false)
      expect(raw.useCache).to.be(false)
      expect(raw.bySegment).to.be(true)
      expect(raw.finalize).to.be(true)
    })
  })
})