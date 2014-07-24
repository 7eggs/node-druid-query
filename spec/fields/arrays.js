'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('.aggregations()', function() {
    it('should create array using array argument', function() {
      var specs = Query.aggregations([
        {type: 'count', name: 'output'}
      ])

      expect(specs).to.eql([
        {type: 'count', name: 'output'}
      ])
      expect(specs).to.be.an(Array)
      expect(specs).to.have.length(1)
    })

    it('should create array using each argument as spec', function() {
      var specs = Query.aggregations({type: 'count', name: 'output'}, {type: 'count', name: 'output'})

      expect(specs).to.eql([
        {type: 'count', name: 'output'},
        {type: 'count', name: 'output'}
      ])
      expect(specs).to.be.an(Array)
      expect(specs).to.have.length(2)
    })
  })

  describe('#aggregations()', function() {
    it('should set value using array argument', function() {
      var raw = query.aggregations([
        {type: 'count', name: 'output'}
      ]).toJSON()

      expect(raw.aggregations).to.eql([
        {type: 'count', name: 'output'}
      ])
      expect(raw.aggregations).to.be.an(Array)
      expect(raw.aggregations).to.have.length(1)
    })

    it('should set value using each argument as spec', function() {
      var raw = query.aggregations({type: 'count', name: 'output'}, {type: 'count', name: 'output'}).toJSON()

      expect(raw.aggregations).to.eql([
        {type: 'count', name: 'output'},
        {type: 'count', name: 'output'}
      ])
      expect(raw.aggregations).to.be.an(Array)
      expect(raw.aggregations).to.have.length(2)
    })
  })

  describe('#dimensions()', function() {
    it('should set value using array argument', function() {
      var raw = query.dimensions(['a', 'b']).toJSON()

      expect(raw.dimensions).to.eql(['a', 'b'])
      expect(raw.dimensions).to.be.an(Array)
      expect(raw.dimensions).to.have.length(2)
    })

    it('should set value using each argument as spec', function() {
      var raw = query.dimensions('x', 'y').toJSON()

      expect(raw.dimensions).to.eql(['x', 'y'])
      expect(raw.dimensions).to.be.an(Array)
      expect(raw.dimensions).to.have.length(2)
    })
  })

  describe('#intervals()', function() {
    it('should set value using array argument', function() {
      var raw = query.intervals(['a', 'b']).toJSON()

      expect(raw.intervals).to.eql(['a', 'b'])
      expect(raw.intervals).to.be.an(Array)
      expect(raw.intervals).to.have.length(2)
    })

    it('should set value using each argument as spec', function() {
      var raw = query.intervals('x', 'y').toJSON()

      expect(raw.intervals).to.eql(['x', 'y'])
      expect(raw.intervals).to.be.an(Array)
      expect(raw.intervals).to.have.length(2)
    })
  })

  describe('#searchDimensions()', function() {
    it('should set value using array argument', function() {
      var raw = query.searchDimensions(['sd1', 'sd2']).toJSON()

      expect(raw.searchDimensions).to.eql(['sd1', 'sd2'])
      expect(raw.searchDimensions).to.be.an(Array)
      expect(raw.searchDimensions).to.have.length(2)
    })

    it('should set value using each argument as spec', function() {
      var raw = query.searchDimensions('sdA', 'sdB').toJSON()

      expect(raw.searchDimensions).to.eql(['sdA', 'sdB'])
      expect(raw.searchDimensions).to.be.an(Array)
      expect(raw.searchDimensions).to.have.length(2)
    })
  })
})