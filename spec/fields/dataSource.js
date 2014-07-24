'use strict'

var expect = require('expect.js')
  , Query = require('./query')


describe('Query', function() {
  var query

  beforeEach(function() {
    query = new Query()
  })

  describe('#dataSource()', function() {
    it('should set dataSource as string', function() {
      var raw = query.dataSource('dataSource1').toJSON()

      expect(raw.dataSource).to.be('dataSource1')
    })

    it('should set dataSource as object', function() {
      var raw = query.dataSource({
        type: 'table',
        name: 'dataSource2'
      }).toJSON()

      expect(raw.dataSource).to.eql({
        type: 'table',
        name: 'dataSource2'
      })
    })

    it('should throw error if bad data source type specified', function() {
      expect(function() {
        query.dataSource('bad_type', 'another argument')
      }).to.throwException()
    })

    describe('Table', function() {
      it('should set spec', function() {
        var raw = query.dataSource('table', 'dataSource3').toJSON()

        expect(raw.dataSource).to.eql({
          type: 'table',
          name: 'dataSource3'
        })
      })

      it('should throw error if data source name is not specified', function() {
        expect(function() {
          query.dataSource('table', null)
        }).to.throwException()
      })
    })

    describe('Query', function() {
      it('should set query using Query instance', function() {
        var dsQuery = new Query()
          , raw

        dsQuery
          .queryType('groupBy')
          .dataSource('dataSource4')
          .dimensions('dimension1', 'dimension2')
          .granularity('day')
          .aggregation('count', 'result')
          .interval(Date.UTC(2010, 0, 1), Date.UTC(2020, 0, 1))

        raw = query.dataSource('query', dsQuery).toJSON()

        expect(raw.dataSource).to.eql({
          type:  'query',
          query: {
            queryType:    'groupBy',
            dataSource:   'dataSource4',
            dimensions:   ['dimension1', 'dimension2'],
            granularity:  'day',
            aggregations: [
              {type: 'count', name: 'result'}
            ],
            intervals:    [
              "2010-01-01T00:00:00.000Z/2020-01-01T00:00:00.000Z"
            ]
          }
        })
      })

      it('should set query using raw query data', function() {
        var dsQuery = {
          queryType:    'groupBy',
          dataSource:   'dataSource5',
          dimensions:   ['dimension3', 'dimension4'],
          granularity:  'day',
          aggregations: [
            {type: 'count', name: 'result'}
          ],
          intervals:    [
            "2010-05-01T00:00:00.000Z/2020-05-01T00:00:00.000Z"
          ]
        }

        var raw = query.dataSource('query', dsQuery).toJSON()

        expect(raw.dataSource).to.eql({
          type:  'query',
          query: {
            queryType:    'groupBy',
            dataSource:   'dataSource5',
            dimensions:   ['dimension3', 'dimension4'],
            granularity:  'day',
            aggregations: [
              {type: 'count', name: 'result'}
            ],
            intervals:    [
              "2010-05-01T00:00:00.000Z/2020-05-01T00:00:00.000Z"
            ]
          }
        })
      })
    })
  })
})
