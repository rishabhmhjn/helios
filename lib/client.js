/**
 * @author rishabhmhjn
 */

var http = require("http"), _ = require("underscore"), logger = require(
    'nlogger').logger(module);
;

/**
 * @param message
 * @param options
 * @returns {SolrClientException}
 */

var solrClient = module.exports = function(options) {
  var defaultSolrClient = {
    host : '127.0.0.1',
    port : '8983',
    core : '',
    path : '/solr'
  };

  this.setClient = function(client) {
    if (typeof client.host == "undefined" || typeof client.port == "undefined"
        || typeof client.path == "undefined") {
      throw new SolrClientException("Bad Client Details", client);
    } else {
      this._client = client;
    }
  };

  this.SolrClientException = function(message, options) {
    this.message = message;
    this.options = options;
    this.name = "SolrClientException";
  };

  if (typeof options != 'undefined') {
    this.setClient(options);
  } else {
    this._client = defaultSolrClient;
  }

  this.getClient = function() {
    return this._client;
  };

  this.get = function(callback) {
    http.get(this._client, function(res) {
      logger.info("Got response: " + res.statusCode);
      callback(null, res);
    }).on('error', function(e) {
      logger.warn("Got error: " + e.message);
      callback(e);
    });
  };

  this.req = function(callback) {
    http.request(this._client, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        callback(null, chunk);
      });
    }).on('error', function(e) {
      callback(e);
    }).end();
  };

  return this;
};

module.exports = solrClient;
