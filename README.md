helios - a nodejs-solr client
=========================
Well, this is a little neater version of the already available nodejs-solr clients.
I figured out that a lot of problems comes to making queries for getting the results.
The powerful thing of this library would be the `queryBuilder` module.

Download
-------
Releases are available for download from
[GitHub](https://github.com/rishabhmhjn/helios/downloads).  
Alternatively, you can install using Node Package Manager (npm) as [helios](https://npmjs.org/package/helios):

    npm install helios


Simple Execution
--------------

```js
var helios = require('Helios')
var solr_client = new Helios.client({
  host : 'localhost', // Insert your client host
  port : 8989,
  path : '/solr' // Insert your client solr path
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
---------------------------------------

### [helios.queryBuilder](#queryBuilder)
### [helios.client](#client)
### [helios.document](#document)

---------------------------------------

<a name="queryBuilder" />
## helios.queryBuilder
### init
```js
var queryBuilder = new Helios.queryBuilder();
```
### methods
All the methods can be used together and can be get as a combined query string by using the `toString()` method

#### simpleQuery
```js
queryBuilder.simpleQuery({
  op : 'OR',
  df : 'field_name',
  q : 'keyword1 keyword2'
})
```

#### facetQuery
```js
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
### init
It can be initialized by passing an `options` object or just by `helios.client()`.  
```js
try {
  var solr_client = new helios.client({
    host : 'localhost', // Insert your client host
    port : 8983,
    path : '/solr' // Insert your client solr path
  });
catch (e) {
  console.log(e);
}
```  
`options` can have host, port & path.  
You can also pass a `proxy : { host : "proxy_host", port : 55 }` in the `options`.

### methods

#### solr_client.select
```js
solr_client.select({
  q : "field_name:value",
  rows : 25,
  start : 50
  // and so on
}, function(err, res) {
  if (err) console.log(err);
  var result = JSON.parse(res); // told you, you have to JSON.parse the res
});
```

#### solr_client.addDoc
It accepts 3 arguments:  
- `solrdoc` : an instance of [helios.document](#document)  
- `commit_flag` : boolean  
- `callback(err)` : a callback which is given an error message upon failure  

```js
var solrdoc = new helios.document();
solrdoc.addField('field_name1', 'value1');
solrdoc.addField('field_name2', 'value2');

solr_client.addDoc(solrdoc, true, function(err) {
  if (err) console.log(err);
});
```

<a name="document" />
## helios.document
