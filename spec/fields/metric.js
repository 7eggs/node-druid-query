'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#metric()', function() {
    it('should set spec', function() {
      var raw = query.metric('numeric', 'metric1').toJSON()

      expect(raw.metric).to.eql({type: 'numeric', metric: 'metric1'})
    })

    it('should set spec (string)', function() {
      var raw = query.metric('metric1').toJSON()

      expect(raw.metric).to.eql('metric1')
    })

    it('should set spec (object)', function() {
      var raw = query.metric({type: 'numeric', metric: 'metric1'}).toJSON()

      expect(raw.metric).to.eql({type: 'numeric', metric: 'metric1'})
    })

    it('should throw error if spec type is invalid', function() {
      expect(function() {
        query.metric('gnumeric', 'metric1')
      }).to.throwException()
    })

    describe('Numeric', function() {
      it('should set spec', function() {
        var raw = query.metric('numeric', 'metric2').toJSON()

        expect(raw.metric).to.eql({type: 'numeric', metric: 'metric2'})
      })

      it('should throw error if metric is not specified', function() {
        expect(function() {
          query.metric('numeric', null)
        }).to.throwException()
      })
    })

    describe('Lexicographic ', function() {
      it('should set spec', function() {
        var raw = query.metric('lexicographic', 'c').toJSON()

        expect(raw.metric).to.eql({type: 'lexicographic', previousStop: 'c'})
      })
    })

    describe('AlphaNumeric  ', function() {
      it('should set spec', function() {
        var raw = query.metric('alphaNumeric', 'd').toJSON()

        expect(raw.metric).to.eql({type: 'alphaNumeric', previousStop: 'd'})
      })
    })
  })
})