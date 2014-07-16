node-druid-query
================

Simple querying for Druid (http://druid.io) in Node.js.

Installation
------------

    npm install druid-query --save

Example
-------

```js
var Druid = require('druid-query')
  , client = new Druid('http://127.0.0.1:8080')

var q1 = client.groupBy()
q1.dataSource('randSeq')
q1.granuality('all')
q1
  .dimensions([])
  .aggregation('count', 'rows')
  .aggregation('doubleSum', 'e', 'events')
  .aggregation('doubleSum', 'randomNumberSum', 'outColumn')
  .postAggregation('arithmetic', 'avg_random', '/', [
    Druid.postAggregation('fieldAccess', null, 'randomNumberSum')
    Druid.postAggregation('fieldAccess', null, 'rows')
  ])
  .intervals(Date.UTC(2012, 9, 1), Date.UTC(2020, 0, 1))

q1.exec(function(err, result) {
  if (err) {
    // handle error...
  }
  else {
    beCoolWith(result)
  }
})
Ч
var q2 = new Druid.TimeBoundaryQuery()
q2.dataSource('wikipedia')
client.exec(q2, function(err, result) {
  // handle results
})
```

Queries
-------

### GroupBy

http://druid.io/docs/0.6.121/GroupByQuery.html

```js
client
  .groupBy()
  .dataSource('sample_datasource')
  .granuality('day')
  .dimensions('dim1', 'dim2')
  .limitSpec('default', 5000, ['dim1', 'metric1'])
  .filter('and', [
    Query.filter('selector', 'sample_dimension1', 'sample_value1'),
    Query.filter('or', [
      Query.filter('selector', 'sample_dimension2', 'sample_value2'),
      Query.filter('selector', 'sample_dimension3', 'sample_value3')
    ])
  ])
  .aggregation('longSum', 'sample_name1', 'sample_fieldName1')
  .aggregation('doubleSum', 'sample_name2', 'sample_fieldName2')
  .postAggregation('arithmetic', 'sample_divide', '/', [
    Query.postAggregation('fieldAccess', 'sample_name1', 'sample_fieldName1'),
    Query.postAggregation('fieldAccess', 'sample_name2', 'sample_fieldName2')
  ])
  .intervals(new Date('2012-01-01T00:00:00.00'), new Date('2012-01-03T00:00:00.000'))
  .having('greaterThan', 'sample_name1', 0)
  .exec(/* result callback */)
```

### Search

http://druid.io/docs/0.6.121/SearchQuery.html

```js
client
  .search()
  .dataSource('sample_datasource')
  .granuality('day')
  .searchDimensions('dim1', 'dim2')
  .query('insensitive_contains', 'Ke')
  .sort('lexicographic')
  .intervals(new Date('2013-01-01T00:00:00.000'), new Date('2013-01-03T00:00:00.000'))
  .exec(/* result callback */)
```

### Segment Metadata

http://druid.io/docs/0.6.121/SegmentMetadataQuery.html

```js
client
  .segmentMetadata()
  .dataSource('sample_datasource')
  .intervals(new Date('2013-01-01'), new Date('2014-01-01'))
  .exec(/* result callback */)
```

### Time Boundary

http://druid.io/docs/0.6.121/TimeBoundaryQuery.html

```js
client
  .timeBoundary()
  .dataSource('sample_datasource')
  .exec(/* result callback */)
```

### Timeseries

http://druid.io/docs/0.6.121/TimeseriesQuery.html

```js
client
  .timeseries()
  .dataSource('sample_datasource')
  .granularity('day')
  .filter('and', [
    Query.filter('selector', 'sample_dimension1', 'sample_value1'),
    Query.filter('or', [
      Query.filter('selector', 'sample_dimension2', 'sample_value2'),
      Query.filter('selector', 'sample_dimension3', 'sample_value3')
    ])
  ])
  .aggregation('longSum', 'sample_name1', 'sample_fieldName1')
  .aggregation('doubleSum', 'sample_name2', 'sample_fieldName2')
  .postAggregation('arithmetic', 'sample_divide', '/', [
    Query.postAggregation('fieldAccess', 'sample_name1', 'sample_fieldName1'),
    Query.postAggregation('fieldAccess', 'sample_name2', 'sample_fieldName2')
  ])
  .intervals(new Date('2013-01-01T00:00:00.000'), new Date('2013-01-03T00:00:00.000'))
  .exec(/* result callback */)
```

### TopN

http://druid.io/docs/0.6.121/TopNQuery.html

```js
client
  .topN()
  .dataSource('sample_data')
  .dimension('sample_dim')
  .threshold(5)
  .metric('count')
  .granularity('all')
  .filter('and', [
    Query.filter('selector', 'dim1', 'some_value'),
    Query.filter('selector', 'dim2', 'some_other_val')
  ])
  .aggregation('longSum', 'count', 'count')
  .aggregation('doubleSum', 'some_metric', 'some_metric')
  .postAggregation('arithmetic', 'sample_divide', '/', [
    Query.postAggregation('fieldAccess', 'some_metric', 'some_metric'),
    Query.postAggregation('fieldAccess', 'count', 'count')
  ])
  .intervals(new Date('2013-08-31T00:00:00.000'), new Date('2013-09-03T00:00:00.000'))
  .exec(/* result callback */)
```

API
---

### Druid

#### Druid(url)

Create client instance.

__Arguments__

* url `string` - Druid node URL.

---

#### `static` fromZooKeeper(connectionString, discoveryPath, [options], callback)

Lookup Druid services via ZooKeeper using [node-zookeper-client](https://www.npmjs.org/package/node-zookeeper-client) and choose random node. For choosed node `Druid` instance is created.

__Arguments__

* connectionString `string` - ZooKeeper connection string.
* discoveryPath `string` - service discovery path.
* options `object` - Lookup options. We have only one option currently available:
    * `preferSSL` - Use SSL port of Druid node if available. Default: `false`.

---

#### dataSources(callback)

Get list of dataSources.

__Arguments__

* callback(err, dataSources) `function` - The callback function.

---

#### exec(query, callback)

Execute query.

__Arguments__

* query `Query` - Query object.
* callback(err, result) `function` - The callback function.

---

### Query field setters

### `static` `object` aggregation(type, name, [aggregationArgs...])

Create aggregation spec.

__Arguments__

* type `string` - Aggregation type: 'cardinality', 'count', 'doubleSum', 'hyperUnique', 'javascript', 'longSum', 'max', 'min.
* name `string` - Aggregation output name.
* aggregationArgs `...*` - Aggregation specific arguments. Read below about arguments in `Aggregations` section.

---

### `static` `object[]` aggregations(list...)

Return array of aggregations.

__Arguments__

* list `object[] | object...` - Array of aggregation specs. Specs can be returned by `Query.aggregation()` or raw JavaScript objects.

---

### `static` `object` postAggregation(type, name, [args...])

Create post-aggregation spec.

__Arguments__

* type `string` - Post-aggregation type: 'arithmetic', 'constant', 'fieldAccess', 'hyperUniqueCardinality', 'javascript'.
* name `string` - Post-aggregation output name.
* args `...*` - Post-aggregation specific arguments. Read about arguments in `Aggregations` section.

---

### `static` `object[]` postAggregations(list...)

Return array of post-aggregation specs.

__Arguments__

* list `object[] | object...` - Array of aggregation specs. They can be ones returned by `Query.aggregation()` or raw JavaScript objects.

---

#### `Query` queryType(type)

Set type of query. This method should be used only if you're using `Query` base class. All the `Query` descendants have `queryType` field set automatically.

__Arguments__

* type `string` - Valid query type: `groupBy`, 'search`, 'segmentMetadata`, `timeBoundary`, `timeseries`, `topN`.

---

### `Query` dataSource(dataSource)

Set `dataSource` field

__Arguments__

* dataSource `string` - Name of data source to query.

---

TODO
----
* Tests :-)
