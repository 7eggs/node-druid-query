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
      var raw = query.context().toJSON()

      expect(raw.context).to.be.empty([])
    })

    it('should create spec', function() {
      var raw = query.context({priority: 100500, bySegment: true}).toJSON()

      expect(raw.context).to.eql({priority: 100500, bySegment: true})
    })

    it('should convert priority to int', function() {
      var raw = query.context({priority: '100500'}).toJSON()

      expect(raw.context).to.eql({priority: 100500})
    })

    it('should throw error if priority is not int', function() {
      expect(function() {
        query.context({priority: 'NaN'})
      }).to.throwException()
    })

    it('should convert bySegment, populateCache, useCache, finalize to boolean', function() {
      var raw = query.context({bySegment: 'yes, sir!', populateCache: 0, useCache: new Boolean(false), finalize: 'no'}).toJSON()

      expect(raw.context).to.eql({bySegment: true, populateCache: false, useCache: false, finalize: true})
    })
  })
})