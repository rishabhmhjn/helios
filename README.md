helios - a nodejs-solr client
=============================
Well, this is a little neater version of the already available nodejs-solr clients.
I figured out that a lot of problems lies in creating queries and documents. 
The powerful thing of this library would be the `queryBuilder` & `document` class.

Download
-------
Releases are available for download from
[GitHub](https://github.com/rishabhmhjn/helios/).  
Alternatively, you can install using Node Package Manager (npm) as [helios](https://npmjs.org/package/helios):

    npm install helios


Simple Execution
--------------

```js
var helios = require('helios')
var solr_client = new helios.client({
  host : 'localhost', // Insert your client host
  port : 8989,
  path : '/solr' // Insert your client solr path
});

var queryBuilder = new helios.queryBuilder();

solr_client.select(queryBuilder.simpleQuery({
  op : 'OR',
  df : 'field_name',
  q : 'keyword1 keyword2'
}), function(err, res) {
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
It accepts two arguments:
- query string OR query object OR an instance of `helios.queryBuilder`
- callback (err, res)

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

#### solr_client.addDoc(helios.document, function(err))
It accepts 3 arguments:  
- `solrdoc` : an instance of [helios.document](#document)  
- `commit_flag` : `boolean`  
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
This class will ease the steps required to make a document to be added to solr.

### init
```js
var solr_doc = new helios.document();
```

### methods
#### getBoost()
This returns the `document`'s boost

#### setBoost
This sets the `document`'s boost to a given `float`
```js
solr_doc.setBoost(2.112);
```

#### setMultiValue
It accepts the following arguments:  
- `field_name`  
- `value` the value of the `field_name`  
- `boost` the boost to be set for `field_name`  

This method is helpful in adding values to a `multi=true` field
```js
solr_doc.setMultiValue('field_name', 'value1', 2);
solr_doc.setMultiValue('field_name', 'value2', 1.5);
```
> note that adding boost every time in the `setMultiValue`
> for the same `field_name` actually results in a compound
> value which is the multiplication of the boosts added  
> eg. for the above case: `2 * 1.5 = 3`

#### getField
This method returns the value set for `field_name`
```js
solr_doc.getField('field_name');
```


#### setField
This methods adds `field_name` whose value is `value` and boost is `boost`.
```js
solr_doc.setField('field_name1', 'value1', 1.2.21);
solr_doc.setField('field_name2', 2121);
```


#### getFieldBoost
This method returns the boost of `field_name`
```js
solr_doc.getFieldBoost("field_name");
```

#### setFieldBoost
This method sets the boost for field name `field_name`
```js
solr_doc.setFieldBoost('field_name', 2.121);
```

#### getFieldBoosts
Returns a key-value object of all the fields and their boosts

#### clear
This clears the all the `fields`, `fieldBoosts` as well as the `documentBoost`

#### toXML
This method converts the current `helios.document` into a solr readable XML
```js
solr_doc.toXML();
```


Issues
======
I know there are a lot of pending tasks and modifications required in this library.
If you find any bug or a feature that you want,
please submit an [issue](https://github.com/rishabhmhjn/helios/issues).
I will respond to it as soon as I can and make required changes to it.
