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
              host : 1111,
              path : 1111,
              port : 11
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
  "NG" : function(test) {
    var solr_client = new solrClient();

    solr_client.req(function(err, res) {
      test.notEqual(err, null, "This request should fail!");
      test.done();
    });
  },

  "OK" : function(test) {
    var solr_client = new solrClient({
      host : 'YOUR_HOST_HERE', // Insert your client host
      port : 80,
      path : '/', // Insert your client solr path
      method : 'GET'
    });

    solr_client.req(function(err, res) {
      test.strictEqual(err, null);
      test.done();
    });

  }

};
