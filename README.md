druid-query
================

[![NPM version](https://badge.fury.io/js/druid-query.svg)](http://badge.fury.io/js/druid-query) [![Build Status](https://travis-ci.org/7eggs/node-druid-query.svg)](https://travis-ci.org/7eggs/node-druid-query)

Simple querying for Druid (http://druid.io) in Node.js. Inspired by [ruby-druid](https://github.com/liquidm/ruby-druid).

Table of Contents:

- [Installation & Introductory Examples](#installation)
- [API](#api)
- [Queries](#queries)
- [TODO](#todo)
- [License](#license)


Installation
------------

    npm install druid-query --save

Example (simple)
----------------

```js
var Druid = require('druid-query')
  , Client = Druid.Client
  , Query = Druid.Query
  , client = new Client('http://127.0.0.1:8080')

var q1 = client.groupBy()
q1.dataSource('randSeq')
q1.granularity('all')
q1
  .dimensions([])
  .aggregation('count', 'rows')
  .aggregation('doubleSum', 'e', 'events')
  .aggregation('doubleSum', 'randomNumberSum', 'outColumn')
  .postAggregation('arithmetic', 'avg_random', '/', [
    Query.postAggregation('fieldAccess', null, 'randomNumberSum')
    Query.postAggregation('fieldAccess', null, 'rows')
  ])
  .interval(Date.UTC(2012, 9, 1), Date.UTC(2020, 0, 1))

q1.exec(function(err, result) {
  if (err) {
    // handle error...
  }
  else {
    beCoolWith(result)
  }
})

var q2 = new Druid.TimeBoundaryQuery()
q2.dataSource('wikipedia')
client.exec(q2, function(err, result) {
  // handle results
})
```

Example (ZooKeeper)
-------------------

```js
var Druid = require('druid-query')
  , druid = new Druid('localhost:2181,localhost:2182/druid', '/broker', {preferSSL: true})


var query = druid.groupBy('myCoolDS')

query
  .filter('selector', 'dimension1', 100500)
  .dimensions('dimension2', 'dimension3')
  .granularity('day')
  .aggregation('count', 'howMany')
  .interval(Date.UTC(2012, 0, 1), Date.UTC(2015, 0, 1))
  .exec(function(err, result) {
    // handle error
    // handle result
  })


var anotherQuery = new Druid.SegmentMetadataQuery()
anotherQuery.dataSource('superDS')
anotherQuery.interval('2011-01-01/2012-01-01')
anotherQuery.interval('2013-01-01/2014-01-01')

druid.exec(anotherQuery, function(err, results) {
  if (err) {
    // error reasons:
    // 1. data source is not served by any known node
    // 2. query validation error
    // 3. error from Druid node after executing query
  }
  else {
    // handle results
  }
})

druid.once('ready', function() {
  // Do what you want with this event :-)
})


druid.on('error', function(err) {
  // handle client error here
})


// Call .end() when finished working with Druid
druid.end()
```

API
---

* [Druid](#druid)
    * [Events](#events)
    * [Druid(connectionString, discoveryPath, [options])](#druidconnectionstring-discoverypath-options)
    * [#cancel(query, callback)](#void-cancelquery-callback)
    * [#end()](#void-end)
    * [#exec(query, callback)](#void-execquery-callback)
    * [#getDataSources()](#string-getdatasources)
    * [#getNodes()](#druidnodes-getnodes)
    * [#groupBy(dataSource, [rawQuery])](#groupbyquery-groupbydatasource-rawquery)
    * [#search(dataSource, [rawQuery])](#searchquery-searchdatasource-rawquery)
    * [#segmentMetadata(dataSource, [rawQuery])](#segmentmetadataquery-segmentmetadatadatasource-rawquery)
    * [#timeBoundary(dataSource, [rawQuery])](#timeboundaryquery-timeboundarydatasource-rawquery)
    * [#timeseries(dataSource, [rawQuery])](#timeseriesquery-timeseriesdatasource-rawquery)
    * [#topN(dataSource, [rawQuery])](#topnquery-topndatasource-rawquery)
* [Client](#client-druidclient)
    * [Client(url)](#clienturl)
    * [.fromZooKeeper(connectionString, discoveryPath, [options], callback)](#static-void-fromzookeeperconnectionstring-discoverypath-options-callback)
    * [#cancel(query, callback)](#void-cancelquery-callback-1)
    * [#dataSources(callback)](#void-datasourcescallback)
    * [#exec(query, callback)](#void-execquery-callback-1)
    * [#groupBy([rawQuery])](#groupbyquery-groupbyrawquery)
    * [#search([rawQuery])](#searchquery-searchrawquery)
    * [#segmentMetadata([rawQuery])](#segmentmetadataquery-segmentmetadatarawquery)
    * [#timeBoundary([rawQuery])](#timeboundaryquery-timeboundaryrawquery)
    * [#timeseries([rawQuery])](#timeseriesquery-timeseriesrawquery)
    * [#topN([rawQuery])](#topnquery-topnrawquery)
* [Query](#query-druidquery)
    * [Query(client, [rawQuery])](#queryclient-rawquery)
    * [#cancel(callback)](#void-cancelcallback)
    * [#exec(callback)](#void-execcallback)
    * [#toJSON()](#object-tojson)
* Field setters ([Query](#query-druidquery) methods)
    * [.aggregation(type, name, [args...])](#static-object-aggregationtype-name-args)
    * [.aggregations(list...)](#static-object-aggregationslist)
    * [.extractionFunction(type, [args...])](#static-object-extractionfunctiontype-args)
    * [.filter(type, [args...])](#static-object-filtertype-args)
    * [.having(type, [args...])](#static-object-havingtype-args)
    * [.interval(start, [end])](#static-object-intervalstart-end)
    * [.orderBy(dimension, [direction])](#static-object-orderbydimension-direction)
    * [.postAggregation(type, name, [args...])](#static-object-postaggregationtype-name-args)
    * [.postAggregations(list...)](#static-object-postaggregationslist)
    * [.query(type, value, caseSensitive)](#static-object-querytype-value)
    * [#aggregation(type, name, [args...])](#query-aggregationtype-name-args)
    * [#aggregations(list...)](#query-aggregationslist)
    * [#bound(value)](#query-boundvalue)
    * [#context(data)](#query-contextdata)
    * [#dataSource(type, args...)](#query-datasourcetype-args)
    * [#dimension(dimension, [outputName], [extractFn])](#query-dimensiondimension-outputname-extractfn)
    * [#dimensions(list...)](#query-dimensionslist)
    * [#filter(type, [args...])](#query-filtertype-args)
    * [#granularity(type, [args...])](#query-granularitytype-args)
    * [#having(type, [args...])](#query-havingtype-args)
    * [#interval(start, [end])](#query-intervalstart-end)
    * [#intervals(intervals...)](#query-intervalsintervals)
    * [#limitSpec(type, limit, orderByColumns)](#query-limitspectype-limit-orderbycolumns)
    * [#merge(value)](#query-mergevalue)
    * [#metric(type, [args...])](#query-metrictype-args)
    * [#postAggregation(type, name, [args...])](#query-postaggregationtype-name-args)
    * [#postAggregations(list...)](#query-postaggregationslist)
    * [#query([type], value...)](#query-querytype-value)
    * [#queryType(type)](#query-querytypetype)
    * [#searchDimensions(list...)](#query-searchdimensionslist)
    * [#sort(type)](#query-sorttype)
    * [#threshold(value)](#query-thresholdvalue)
    * [#toInclude(value)](#query-toincludevalue)

---

### Druid

Client which uses ZooKeeper to get data about Druid nodes and then gets data sources served by each node.

#### Events

* `ready` - emitted when client finished (re)loading of nodes data (so it's ready to use). If client occasionally looses connection to ZooKeeper it's re-establed and client loads node data again.
* `error` - emitted when client receives any kind of error.

#### Druid(connectionString, discoveryPath, [options])

Create client instance.

__Arguments__

* connectionString `string` - ZooKeeper connection string.
* discoveryPath `string` - Service discovery path.
* options `object` - Client options.
    * `zookeeper` - Options passed to `node-zookeeper-client` [createClient()](https://github.com/alexguan/node-zookeeper-client#client-createclientconnectionstring-options) function.
    * `preferSSL` - Use SSL port of Druid node if available. Default: `false`.

---

#### void cancel(query, callback)

Cancel query. Works same way as [#exec(query, callback)](#void-execquery-callback).

__Arguments__

* query `Query` - `Query` (or descendant class) instance.
* callback `function` - Callback function with following signature: `(err)`.

---

#### void end()

End working with client.

---

#### void exec(query, callback)

Run `query` on suitable node.

If client is not `ready` (read [Events](#events) section above) method will wait for `ready` or `error` event to continue.

If `query` data source is not among served by found nodes `callback` will be called with corresponding error.

Once node with least number of concurrent running queries is choosed `query` is sent to it.

__Arguments__

* query `Query` - `Query` (or descendant class) instance.
* callback `function` - Callback function with following signature: `(err, result)`.

---


#### `string[]` getDataSources()

Get list of data sources.

---

#### `DruidNodes[]` getNodes()

Get list of Nodes available.

`DruidNode` extends `Druid.Client`. It keeps ZooKeeper node data and number of concurrent running queries (used for simple load-balancing).

---

#### `GroupByQuery` groupBy(dataSource, [rawQuery])
#### `SearchQuery` search(dataSource, [rawQuery])
#### `SegmentMetadataQuery` segmentMetadata(dataSource, [rawQuery])
#### `TimeBoundaryQuery` timeBoundary(dataSource, [rawQuery])
#### `TimeseriesQuery` timeseries(dataSource, [rawQuery])
#### `TopNQuery` topN(dataSource, [rawQuery])

Return query instance with `dataSource` set. Query is attached to calling `Druid` instance, so [Druid#exec(query, callback)](#void-execquery-callback) is called to execute query.

__Arguments__

* dataSource `string` - name of data source to create `Query` for.
* rawQuery `object` - passed to `Query` constructor as second argument.

---

### Client (Druid.Client)

Base client class which uses Druid node URL.

#### Client(url)

Create client instance.

__Arguments__

* url `string` - Druid node URL.

---

#### `static` void fromZooKeeper(connectionString, discoveryPath, [options], callback)

Lookup Druid services via ZooKeeper using [node-zookeper-client](https://www.npmjs.org/package/node-zookeeper-client) and choose random node. For choosed node `Client` instance is created.

__Arguments__

* connectionString `string` - ZooKeeper connection string.
* discoveryPath `string` - service discovery path.
* options `object` - Lookup options. We have only one option currently available:
    * `preferSSL` - Use SSL port of Druid node if available. Default: `false`.

---

#### void cancel(query, callback)

Cancel query.

__Arguments__

* query `Query` - Query object.
* callback(err) `function` - The callback function.

---

#### void dataSources(callback)

Get list of dataSources.

__Arguments__

* callback(err, dataSources) `function` - The callback function.

---

#### void exec(query, callback)

Execute query.

__Arguments__

* query `Query` - Query object.
* callback(err, result) `function` - The callback function.

---

#### `GroupByQuery` groupBy([rawQuery])
#### `SearchQuery` search([rawQuery])
#### `SegmentMetadataQuery` segmentMetadata([rawQuery])
#### `TimeBoundaryQuery` timeBoundary([rawQuery])
#### `TimeseriesQuery` timeseries([rawQuery])
#### `TopNQuery` topN([rawQuery])

Create `Query` instance and attach it to client.

__Arguments__

* rawQuery `object` - passed as second argument to `Query` constructor.

---

### Query (Druid.Query)

__Note:__ each field method returns field value if no arguments specified.

#### Query(client, [rawQuery])

Create query instance

__Arguments__

* client `Client` - Client instance.
* rawQuery `object` - Raw query data (so you can call `Query#exec(callback)` or `Druid#exec(query, callback)` right after creating `Query` object. Keep in mind that if constructor is not base `Query` class (e.g. `GroupByQuery`) `queryType` property is first removed from `rawQuery` object to prevent errors.

---

#### void cancel(callback)

Cancel query. `context.queryId` should be set for this.

__Arguments__

* callback(err) `function` - The callback function.

---

#### void exec(callback)

Execute query (only if it's attached to client e.g. created by some client instance).

__Arguments__

* callback(err, result) `function` - The callback function.

---

#### `object` toJSON()

Returns query data.

---

#### `static` `object` aggregation(type, name, [args...])

Create aggregation spec.

__Arguments__

* type `string | object` - Aggregation type: `cardinality`, `count`, `doubleSum`, `hyperUnique`, `javascript`, `longSum`, `max`, `min`. Also you can specify aggregation as object in this argument.
* name `string` - Aggregation output name.
* args `...*` - Aggregation-specific arguments.

__Query.aggregation('cardinality', name, fieldNames, byRow)__

* fieldNames `string[]` - Fields to compute cardinality over.
* byRow `boolean` - If we should compute cardinality over distinct combinations. Default: `false`.

__Query.aggregation('count', name)__

* No arguments here

__Query.aggregation('doubleSum', name, fieldName)__

* fieldName `string` - Name of the metric column to sum over.

__Query.aggregation('hyperUnique', name, fieldName)__

* fieldName `string` - Dimension name.

__Query.aggregation('javascript', name, fieldNames, aggregateFn, combineFn, resetFn)__

* fieldNames `string[]` - Names of fields which are passed to aggregate function.
* aggregateFn `string | function` - Aggregation function.
* combineFn `string | function` - Combines partials.
* resetFn `string | function` - Initialization function.

__Query.aggregation('longSum', name, fieldName)__

* fieldName `string` - Name of the metric column to sum over.

__Query.aggregation('max', name, fieldName)__

* fieldName `string` - Name of the metric column.

__Query.aggregation('min', name, fieldName)__

* fieldName `string` - Name of the metric column.

---

#### `static` `object[]` aggregations(list...)

Return array of aggregations.

__Arguments__

* list `object[] | object...` - Array of aggregation specs. Specs can be returned by [Query.aggregation()](#static-object-aggregationtype-name-args) or raw JavaScript objects.

---

#### `static` `object` extractionFunction(type, [args...])

Create `DimExtractionFn` spec.

__Arguments__

* type `string | object` - Spec type: `javascript`, `partial`, `regex`, `searchQuery`, `time` - or DimExtractionFn spec object.
* args `...*` - Function-specific arguments.

__Query.extractionFunction('javascript', fn)__

* fn `string | function` - JavaScript function.

__Query.extractionFunction('partial', regex)__

* regex `string | RegExp` - Regular expression to match.

__Query.extractionFunction('regex', regex)__

* regex `string | RegExp` - Regular expression to match.

__Query.extractionFunction('searchQuery`, query...)__

* query `object | ...*` - If one argument is specified we treat it as `SearchQuerySpec` object. Otherwise [Query.query()](#static-object-querytype-value) is called for all the passed arguments.

__Query.extractionFunction('time', input, output)__

* input `string` - Input time format.
* output `string` - Output time format.

---

#### `static` `object` filter(type, [args...])

Create filter spec.

__Arguments__

* type `string | object` - Filter type: `and`, `javascript`, `not`, `or`, `regex`, `selector`, `search` - or raw filter object.
* args `...*` - Filter-specific arguments. Described below.

__Query.filter('and', filters...)__

* filters `object[] | ...object` - List of filters for `AND`.

__Query.filter('javascript', dimension, fn)__

* dimension `string` - Dimension to which filter is applied.
* fn `string | function` - Function to apply (should return boolean value).

__Query.filter('not', filter...)__

* filter `string | ...*` - If this argument is object we use it as filter spec. Otherwise all arguments are passed again to [Query.filter()](#static-object-filtertype-args).

__Query.filter('or', filters...)__

* filters `object[] | ...object` - List of filters for `OR`.

__Query.filter('regex', dimension, pattern)__

* dimension `string` - Dimension to which filter is applied.
* pattern `string` - Java regular expression.

__Query.filter('selector', dimension, value)__

* dimensions `string` - Dimension to which filter is applied.
* value `*` - Value to match.

__Query.filter('search', dimension, query)__

* dimensions `string` - Dimension to which filter is applied.
* query `*` - `SearchQuerySpec` object

---

#### `static` `object` having(type, [args...])

Create `having` spec.

__Arguments__

* type `string | object` - HavingSpec object or type: `and`, `equalTo`, `greaterThan`, `lessThan`, `not`, `or`.
* args `...*` - Arguments specific to spec type.

__Query.having('and', specs...)__

* specs `object[] | ...object` - List of specs for `AND` operation.

__Query.having('equalTo', aggregation, value)__

* aggregation `string` - Aggregation name.
* value `*` - Value to match.

__Query.having('greaterThan', aggregation, value)__

* aggregation `string` - Aggregation name.
* value `*` - Value to compare.

__Query.having('lessThan', aggregation, value)__

* aggregation `string` - Aggregation name.
* value `*` - Value to compare.

__Query.having('not', spec...)__

* spec `object | ...*` - If first argument is object we use it as filter spec. Otherwise all arguments are passed again to [Query.having()](#static-object-havingtype-args).

__Query.having('or', specs...)__

* specs `object[] | ...object` - List of specs for `OR` operation.

---

#### `static` `object` interval(start, [end])

Create interval string.

Of one argument specified it's treated as interval string.

__Arguments__

* start `string | number | Date` - Interval string or start time as timestamp, date string or `Date` object.
* end `string | number | Date` - End time.

---

#### `static` `object` orderBy(dimension, [direction])

Create OrderBy spec.

__Arguments__

* dimension `string` - Dimension to sort by.
* direction `string` - Sorting direction. Default: `ASCENDING`.

---

#### `static` `object` postAggregation(type, name, [args...])

Create post-aggregation spec.

__Arguments__

* type `string | object` - Post-aggregation type: `arithmetic`, `constant`, `fieldAccess`, `hyperUniqueCardinality`, `javascript`. Or it can be ready-to-use post-aggregation object (no need in other arguments in this case, of course).
* name `string` - Post-aggregation output name.
* args `...*` - Post-aggregation specific arguments. Read about arguments below.

__Query.postAggregation('arithmetic', name, op, fields)__

* op `string` - Arithmetic operation: +, -, * or /.
* fields `object[] | ...object` - List of Post-Aggregation specs: raw objects or [Query.postAggregation()](#static-object-postaggregationtype-name-args) results.

__Query.postAggregation('constant', name, value)__

* value `*` - Constant value.

__Query.postAggregation('fieldAccess', name, fieldName)__

* fieldName `string` - Name of aggregator field. If not specified `postAggregation()` second argument (`name`) is used as `fieldName` instead.

__Query.postAggregation('hyperUniqueCardinality', name, fieldName)__

* fieldName `string` - Name of hyperUnique aggregator. If not specified `postAggregation()` second argument (`name`) is used as `fieldName` instead.

__Query.postAggregation('javascript', name, fieldNames, fn)__

* fieldNames `string[]` - List of aggregator names - passed as arguments to function.
* fn `string | function` - Post-aggregator function.

---

#### `static` `object[]` postAggregations(list...)

Return array of post-aggregation specs.

__Arguments__

* list `object[] | object...` - Array of aggregation specs. They can be ones returned by [Query.postAggregation()](#static-object-postaggregationtype-name-args) or raw JavaScript objects.

---

#### `static` `object` query(type, value...)

Create SearchQuery spec.

__Arguments__

* type `string | object` - SearchQuery type: `insensitive_contains`, `fragment`. Or ready SearchQuerySpec object.
* value `string | string[] | ...string` - Value(s) to match. If `type` is `fragment` value (or all the values) is treated as array. If type is `insensitive_contains` value is used as `string`.

---

#### `Query` aggregation(type, name, [args...])

Add aggregation spec to `aggregations`.

__Arguments__

* type `string | object` - Aggregation type: `cardinality`, `count`, `doubleSum`, `hyperUnique`, `javascript`, `longSum`, `max`, `min`. Or aggregation spec as JS object.
* name `string` - Aggregation output name.
* args `...*` - Aggregation specific arguments. Read above about arguments in [Query.aggregation()](#static-object-aggregationtype-name-args) description.

---

#### `Query` aggregations(list...)

Set `aggregations` field.

__Arguments__

* list `object[] | object...` - Array of aggregation specs. Specs can be returned by [Query.aggregation()](#static-object-aggregationtype-name-args) or raw JavaScript objects.

---

#### `Query` bound(value)

Set `bound` field for [TimeBoundaryQuery](#timeboundaryquery-timeboundarydatasource-rawquery).

__Arguments__

* value `string` - Must be either `"minTime"` or `"maxTime"`. Otherwise error is thrown.

---

#### `Query` context(data)

Set `context` field. Read more about it [here](http://druid.io/docs/latest/Querying.html).

__Arguments__

* data `object`
    * `timeout` `number`
    * `priority` `number`
    * `queryId` `string`
    * `useCache` `boolean`
    * `populateCache` `boolean`
    * `bySegment` `boolean`
    * `finalize` `boolean`

---

#### `Query` dataSource(type, args...)

Set `dataSource` field

__Arguments__

* type `string | object` - Data source type. Or data source as string or as object ([DataSource](http://druid.io/docs/0.6.121/DataSource.html) structure).
* args `...*` - Arguments specific to each data source type.

__Query#dataSource('table', name)__

* name `string` - Name of data source.

__Query#dataSource('query', subQuery)__

* subQuery `object | Query` - Sub-query as Query instance or raw query object.

---

#### `Query` dimension(dimension, [outputName], [extractFn])

Set DimensionSpec. 

If first argument is an object, then just use it as DimensionSpec.

If not depending on arguments length creates default or extraction dimension spec.

If second or third argument is object ExtractionDimensionSpec is created.

In other cases DefaultDimensionSpec is created.

__Arguments__

* dimension `string | object` - Dimension to operate on. Or dimension definition as object.
* outputName `string` - Dimension output name.
* extractFn `object` - Extraction function spec created by [Query.extractionFunction()](#static-object-extractionfunctiontype-args) or raw JavaScript object.

---

#### `Query` dimensions(list...)

Set dimensions.

__Arguments__

* list `string[] | ...string` - Dimensions list.

---

#### `Query` filter(type, [args...])

Set filter spec.

__Arguments__

* type `string | object` - Filter type: `and`, `javascript`, `not`, `or`, `regex`, `selector`. Otherwise whole filter object can be specified as first argument.
* args `...*` - Filter-specific arguments. They are described in [Query.filter()](#static-object-filtertype-args) method description.

---

#### `Query` granularity(type, [args...])

Set granularity of query.

__Arguments__

* value `string | object` - Granularity as string or object. If `value` is string it must be one of those: `all`, `none`, `minute`, `fifteen_minute`, `thirty_minute`, `hour`, `day` plus `duration` and `period` which mean granularity spec object is created.
* args `...*` - Specific arguments (in case if `value` is `period` or `duration`).

__Query#granularity('duration', duration, [origin])__

* duration `string | number` - Duration value in ms.
* origin `string | number | Date` - Start time (optional).

__Query#granularity('period', period, [timeZone], [origin])__

* period `string` - ISO-8601 duration format.
* timeZone `string` - Timezone. Default: UTC (optional).
* origin `string | number | Date` - Start time (optional).

---

#### `Query` having(type, [args...])

Set `having` field.

__Arguments__

* type `string | object` - HavingSpec object or type: `and`, `equalTo`, `greaterThan`, `lessThan`, `not`, `or`.
* args `...*` - Arguments specific to spec type. They are described in [Query.having()](#static-object-havingtype-args).

---

#### `Query` interval(start, [end])

Add interval string to `intervals` field.

__Arguments__

* start `number | string | Date` - Start time or interval string.
* end `number | string | Date` - End time.

---

#### `Query` intervals(intervals...)

Set intervals.

__Arguments__

* list `string[] | ...string` - List of interval strings.

---

#### `Query` limitSpec(type, limit, orderByColumns)

Set LimitSpec field.

__Arguments__

* type `string | object` - raw LimitSpec object or LimitSpec type.
* limit `number` - Limit of records returned.
* orderByColumns `object[] | string[]` - OrderBy specs array. Specs can be strings or results of [Query.orderBy()](#static-object-orderbydimension-direction)

---

#### `Query` merge(value)

Set `merge` field value.

__Arguments__

* value `boolean` - Merge all individual segment metadata results into a single result.

---

#### `Query` metric(type, [args...])

Set `TopNMetricSpec` identified by `metric` value.

__Arguments__

* type `string | object` - `TopNMetricSpec` object or spec type: `alphaNumeric`, `lexicographic`, `numeric`.
* args `...*` - Arguments specific to spec type. They are described below.

__Query#metric('alphaNumeric', [previousStop])__

* previousStop `string` - The starting point of the lexicographic sort (optional).

__Query#metric('lexicographic', [previousStop])__

* previousStop `string` - The starting point of the alpha-numeric sort (optional).

__Query#metric('numeric', metric)__

* metric `string` - The actual metric field in which results will be sorted by.

---

#### `Query` postAggregation(type, name, [args...])

Add post-aggregation spec to `postAggregations` array.

__Arguments__

* type `string | object` - Post-aggregation type: `arithmetic`, `constant`, `fieldAccess`, `hyperUniqueCardinality`, `javascript`. It can be post-aggregation object itself.
* name `string` - Post-aggregation output name.
* args `...*` - Post-aggregation specific arguments. Read above about arguments in [Query.postAggregation()](#static-object-postaggregationtype-name-args) method description.

---

#### `Query` postAggregations(list...)

Set `postAggregations` field.

__Arguments__

* list `object[] | object...` - Array of aggregation specs. They can be ones returned by [Query.postAggregation()](#static-object-postaggregationtype-name-args) or raw JavaScript objects.

---

#### `Query` query([type], value, caseSensitive)

Set SearchQuery spec (`query` field).

__Arguments__

* type `string | object` - SearchQuery type: `insensitive_contains`, `fragment`, `contains`. Or it can be `SearchQuerySpec` object.
* value `string | string[]` - Value(s) to match. If `type` is `fragment` value is treated as array. If type is `insensitive_contains` value is used as `string`.
* caseSensitive `boolean` -  Whether strings should be compared as case sensitive or not. Has no effect for type `insensitive_contains`.

---

#### `Query` queryType(type)

Set type of query. This method should be used only if you're using `Query` base class. All the `Query` descendants have `queryType` field set automatically.

__Arguments__

* type `string` - Valid query type: `groupBy`, `search`, `segmentMetadata`, `timeBoundary`, `timeseries`, `topN`.

---

#### `Query` searchDimensions(list...)

Set `searchDimensions` field.

__Arguments__

* list `string[] | ...string` - Dimensions list.

---

#### `Query` sort(type)

Set `sort` field.

__Arguments__

* type `string` - Sorting type: `lexicographic` or `strlen`.

---

#### `Query` threshold(value)

Set `threshold` value.

__Arguments__

* value `number` - Threshold number value.

---

#### `Query` toInclude(value)

Set `toInclude` field - columns which should be returned in result.

__Arguments__

* value `string | string[] | object` - `all`, `none` or array of column names (list) or `toInclude` raw spec data as object.

---

Queries
-------

### GroupBy (Druid.GroupByQuery)

http://druid.io/docs/0.6.121/GroupByQuery.html

```js
client
  .groupBy()
  .dataSource('sample_datasource')
  .granularity('day')
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

### Search (Druid.SearchQuery)

http://druid.io/docs/0.6.121/SearchQuery.html

```js
client
  .search()
  .dataSource('sample_datasource')
  .granularity('day')
  .searchDimensions('dim1', 'dim2')
  .query('insensitive_contains', 'Ke')
  .sort('lexicographic')
  .intervals(new Date('2013-01-01T00:00:00.000'), new Date('2013-01-03T00:00:00.000'))
  .exec(/* result callback */)
```

### Segment Metadata (Druid.SegmentMetadataQuery)

http://druid.io/docs/0.6.121/SegmentMetadataQuery.html

```js
client
  .segmentMetadata()
  .dataSource('sample_datasource')
  .intervals(new Date('2013-01-01'), new Date('2014-01-01'))
  .exec(/* result callback */)
```

### Time Boundary (Druid.TimeBoundaryQuery)

http://druid.io/docs/0.6.121/TimeBoundaryQuery.html

```js
client
  .timeBoundary()
  .dataSource('sample_datasource')
  .exec(/* result callback */)
```

### Timeseries (Druid.TimeseriesQuery)

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

### TopN (Druid.TopNQuery)

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

TODO
----

* More tests

LICENSE
-------

MIT
