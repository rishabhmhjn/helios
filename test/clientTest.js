/**
 * 
 */

var solrClient = require("../lib/client"), logger = require('nlogger').logger(
    module);
;

exports.clientInit = function(test) {

  test.expect(3);

  test
      .doesNotThrow(
          function() {
            new solrClient({
              host : "127.0.0.1",
              path : "/solr",
              port : 8983
            });
          },
          "",
          "If an object containing host, port & path is passed as param to the solrClient,"
              + " it should not throw an error");

  test
      .doesNotThrow(function() {
        new solrClient();
      }, {},
          "Not passing any argument will set default values as the client information");

  test.throws(function() {
    new solrClient({});
  }, solrClient.SolrClientException,
      "If an incomplete object is passed as the parameter to the {solrClient}, "
          + "it throws an exception");

  test.done();
};

exports.clientExecute = {
  "NG for bad server" : function(test) {
    var solr_client = new solrClient();

    solr_client.select("q=movie_name:winnie", function(err, res) {
      test.notEqual(err, null, "This request should fail!");
      test.done();
    });
  },

  "OK for query object" : function(test) {
    var solr_client = new solrClient({
      host : 'localhost', // Insert your client host
      port : 8983,
      path : '/solr', // Insert your client solr path
      method : 'POST'
    });

    solr_client.select({
      q : "field_name:keyword"
    }, function(err, res) {
      // logger.debug(res);
      test.strictEqual(err, null);
      test.done();
    });

  },

  "OK for query string" : function(test) {
    var solr_client = new solrClient({
      host : 'localhost', // Insert your client host
      port : 8983,
      path : '/solr', // Insert your client solr path
      method : 'POST'
    });

    solr_client.select('q=field_name:keyword', function(err, res) {
      // logger.debug(res);
      test.strictEqual(err, null);
      test.done();
    });

  }

};
