nodejs-solr-client
==================
Well, this is a little neater version of the already available nodejs-solr clients. I figured out that a lot of problems comes to making queries for getting the results. The powerful thing of this library would be the `queryBuilder` library.

Simple Execution

```javascript
var Helios = require('Helios')
var solr_client = new Helios.client({
  host : 'localhost', // Insert your client host
  port : 8989,
  path : '/solr', // Insert your client solr path
});

var queryBuilder = new Helios.queryBuilder();

solr_client.select(queryBuilder.simpleQuery({
  op : 'OR',
  df : 'field_name',
  keywords : 'keyword1 keyword2'
}).get(), function(err, res) {
  if (err) console.log(err);
  console.log(JSON.parse(res)); // returns in raw format
});
```