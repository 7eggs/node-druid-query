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

var q1 = client.query()
q1.type('groupBy')
q1.dataSource('randSeq')
q1.granuality('all')
q1
  .dimensions([])
  .aggregation('count', 'rows')
  .aggregation('doubleSum', 'e', 'events')
  .aggregation('doubleSum', 'randomNumberSum', 'outColumn')
q1
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

// You can create un-attached query and execute it over client
var q2 = new Druid.Query()
q2.type('timeBoundary')
q2.dataSource('wikipedia')
client.exec(q2, function(err, result) {
  // handle results
})
```

TODO
----

* Tests :-)
