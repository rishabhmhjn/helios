/**
 * clientTest is incomplete! do not trust it!
 * 
 * @TODO need to complete these tests
 * @author rishabhmhjn
 */

// set this flag to false if you have your solr settings correct
var skip = true;

var helios = require("../"), logger = require('nlogger').logger(module);

exports.clientInit = function(test) {
  if (skip) return test.done();

  test.expect(3);

  test
      .doesNotThrow(
          function() {
            new helios.client({
              host : "127.0.0.1",
              path : "/solr",
              port : 8983
            });
          },
          helios.client.SolrClientException,
          "If an object containing host, port & path is passed as param to the helios.client,"
              + " it should not throw an error");

  test
      .doesNotThrow(function() {
        new helios.client();
      }, helios.client.SolrClientException,
          "Not passing any argument will set default values as the client information");

  test.throws(function() {
    new helios.client({
      host : 111
    });
  }, helios.client.SolrClientException,
      "If an bad client object is passed as the parameter to the {helios.client},"
          + " it throws an exception");

  test.done();
};

exports.clientExecute = {
  "NG for bad server" : function(test) {
    if (skip) return test.done();

    var solr_client = new helios.client();

    solr_client.select("q=field_name:value", function(err, res) {
      test.notEqual(err, null, "This request should fail!");
      test.done();
    });
  },

  "OK for query as an object" : function(test) {
    if (skip) return test.done();

    var solr_client = new helios.client({
      host : 'localhost', // Insert your client host
      port : 8983,
      path : '/solr' // Insert your client solr path
    });

    solr_client
        .select(
            {
              q : "field_name:keyword"
            },
            function(err, res) {
              test
                  .strictEqual(err, null,
                      "There should be no error if the server details and query is correct");
              test.done();
            });
  },

  "OK for query as a string" : function(test) {
    if (skip) return test.done();

    var solr_client = new helios.client({
      host : 'localhost', // Insert your client host
      port : 8983,
      path : '/solr' // Insert your client solr path
    });

    var queryBuilder = new helios.queryBuilder();

    solr_client.select(queryBuilder.simpleQuery({
      op : 'OR',
      df : 'field_name',
      keywords : 'keyword'
    }), function(err, res) {
      // logger.debug(res);
      test.strictEqual(err, null);
      test.done();
    });

  },

  "Facet Query Test" : function(test) {
    if (skip) return test.done();

    var solr_client = new helios.client({
      host : 'localhost', // Insert your client host
      port : 8983,
      path : '/solr' // Insert your client solr path
    });

    var queryBuilder = new helios.queryBuilder();

    queryBuilder.facetQuery({
      "facet" : true,
      "facet.field" : [ 'field_name' ]
    });

    solr_client.select(queryBuilder.toString(), function(err, res) {
      // logger.debug(res);
      test.strictEqual(err, null);
      test.done();
    });
  },

  "Document Add" : {
    "Add" : function(test) {
      if (skip) return test.done();

      var solrdoc = new helios.document();
      solrdoc.addField('field_name', 'value');

      var solr_client = new helios.client({
        host : 'localhost', // Insert your client host
        port : 8983,
        path : '/solr' // Insert your client solr path
      });

      solr_client.addDoc(solrdoc, true, function() {
        test.done();
      });
    }

  }

};
