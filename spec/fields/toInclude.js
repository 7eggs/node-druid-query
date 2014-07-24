'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#toInclude()', function() {
    it('should set spec (string)', function() {
      var raw = query.toInclude('all').toJSON()

      expect(raw.toInclude).to.eql({
        type: 'all'
      })
    })

    it('should set spec (string) #2', function() {
      var raw = query.toInclude('none').toJSON()

      expect(raw.toInclude).to.eql({
        type: 'none'
      })
    })

    it('should set spec (object)', function() {
      var raw = query.toInclude({type: 'all'}).toJSON()

      expect(raw.toInclude).to.eql({
        type: 'all'
      })
    })

    it('should set spec (array)', function() {
      var raw = query.toInclude(['column1', 'column2']).toJSON()

      expect(raw.toInclude).to.eql({
        type:    'list',
        columns: ['column1', 'column2']
      })
    })

    it('should throw error if bad value is specified', function() {
      expect(function() {
        query.toInclude(null)
      }).to.throwException()
    })
  })
})