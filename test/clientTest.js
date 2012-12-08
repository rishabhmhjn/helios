/**
 * @author rishabhmhjn
 */

var Helios = require("../"), logger = require('nlogger').logger(module);

exports.clientInit = function(test) {

  test.expect(3);

  test
      .doesNotThrow(
          function() {
            new Helios.client({
              host : "127.0.0.1",
              path : "/solr",
              port : 8983
            });
          },
          Helios.client.SolrClientException,
          "If an object containing host, port & path is passed as param to the Helios.client,"
              + " it should not throw an error");

  test
      .doesNotThrow(function() {
        new Helios.client();
      }, Helios.client.SolrClientException,
          "Not passing any argument will set default values as the client information");

  test.throws(function() {
    new Helios.client({
      host : 111
    });
  }, Helios.client.SolrClientException,
      "If an bad client object is passed as the parameter to the {Helios.client},"
          + " it throws an exception");

  test.done();
};

exports.clientExecute = {
  "NG for bad server" : function(test) {
    var solr_client = new Helios.client();

    solr_client.select("q=field_name:value", function(err, res) {
      test.notEqual(err, null, "This request should fail!");
      test.done();
    });
  },

  "OK for query as an object" : function(test) {
    var solr_client = new Helios.client({
      host : 'localhost', // Insert your client host
      port : 8983,
      path : '/solr', // Insert your client solr path
      method : 'GET'
    });

    solr_client.select({
      q : "field_name:value"
    }, function(err, res) {
      // logger.debug(res);
      test.strictEqual(err, null, "This should return a correct result");
      test.done();
    });
  },

  "OK for query as a string" : function(test) {
    var solr_client = new Helios.client({
      host : 'localhost', // Insert your client host
      port : 8983,
      path : '/solr', // Insert your client solr path
      method : 'GET'
    });

    var queryBuilder = new Helios.queryBuilder();

    solr_client.select(queryBuilder.simpleQuery({
      op : 'OR',
      df : 'field_name',
      keywords : 'keyword'
    }).toString(), function(err, res) {
      // logger.debug(res);
      test.strictEqual(err, null);
      test.done();
    });

  },

  "Facet Query Test" : function(test) {
    var solr_client = new Helios.client({
      host : 'localhost', // Insert your client host
      port : 8983,
      path : '/solr', // Insert your client solr path
      method : 'GET'
    });

    var queryBuilder = new Helios.queryBuilder();

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
      var solrdoc = new Helios.document();
      solrdoc.addField('field_name', 'value');

      var solr_client = new Helios.client({
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
