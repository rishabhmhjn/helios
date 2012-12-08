helios - a nodejs-solr client
=========================
Well, this is a little neater version of the already available nodejs-solr clients.
I figured out that a lot of problems comes to making queries for getting the results.
The powerful thing of this library would be the `queryBuilder` module.

Download
-------
Releases are available for download from
[GitHub](https://github.com/rishabhmhjn/helios/downloads).
Alternatively, you can install using Node Package Manager (npm):

    npm install helios


Simple Execution
--------------

```javascript
var helios = require('Helios')
var solr_client = new Helios.client({
  host : 'localhost', // Insert your client host
  port : 8989,
  path : '/solr', // Insert your client solr path
});

var queryBuilder = new Helios.queryBuilder();

solr_client.select(queryBuilder.simpleQuery({
  op : 'OR',
  df : 'field_name',
  q : 'keyword1 keyword2'
}).toString(), function(err, res) {
  if (err) console.log(err);
  console.log(JSON.parse(res)); // yes, it returns in raw format, you need to JSON.parse it
});
```

Documentation
-------------
### [helios.queryBuilder](#queryBuilder)
### [helios.client](#client)
### [helios.document](#document)


---------------------------------------

<a name="queryBuilder" />
## helios.queryBuilder
### init
```javascript
var queryBuilder = new Helios.queryBuilder();
```
### methods
All the methods can be used together and can be get as a combined query string by using the `toString()` method

#### simpleQuery
```javascript
queryBuilder.simpleQuery({
  op : 'OR',
  df : 'field_name',
  q : 'keyword1 keyword2'
})
```

#### facetQuery
```javascript
queryBuilder.facetQuery({
  'facet' : 'true',
  'facet.date' : 'timestamp',
  'facet.date.start' : 'NOW/DAY-5DAYS',
  'facet.date.end' : 'NOW/DAY+1DAY',
  'facet.date.gap' : '+1DAY'
});
```

#### toString
It just returns the query you have made as a `string`



<a name="client" />
## helios.client



<a name="document" />
## helios.document




