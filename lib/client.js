/**
 * @author rishabhmhjn
 */

var utils = require('./utils'), http = require("http"), _ = require("underscore"), logger = require(
    'nlogger').logger(module);
;

var solrResponseDoc = function(doc) {
  this.doc = doc;

  this.get = function(key) {
    if (typeof this.doc[key] == "undefined") {
      return false;
    } else {
      return this.doc[key];
    }
  };

  this.getFields = function() {
    return _.keys(this.doc);
  };

  return this;
};

/**
 * @param message
 * @param options
 * @returns {SolrClientException}
 */

var solrClient = function(init_opts) {
  var defaultSolrClient = {
    host : '127.0.0.1',
    port : '8983',
    core : null,
    path : '/solr',
    method : 'GET'
  };

  var SolrClientException = function(message, options) {
    this.message = message;
    this.options = options;
    this.name = "SolrClientException";
  };

  this.SolrClientException = SolrClientException;

  // defining methods
  this.setClient = function(client) {
    if (typeof client.host != "string" || _.isNaN(parseInt(client.port))
        || typeof client.path != "string") {
      throw new SolrClientException("Bad Client Details", client);
    } else {
      this._client = client;
    }
  };

  this.getClient = function() {
    return this._client;
  };

  function executeQuery(options, callback, context) {
    var _data = '';
    // logger.debug(options);
    http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        _data += chunk;
      });
      res.on("end", function() {
        callback(null, JSON.parse(_data));
      });
    }).on('error', function(e) {
      callback(e);
    }).end();
  }
  ;

  this.select = function(options, callback, context) {
    var def_qp = utils.serializeObj({
      omitHeader : true,
      indent : 'off',
      wt : "json"
    });
    var query = '';
    if (typeof options == 'string') {
      query = options;
    } else {
      query = utils.serializeObj(options);
    }

    var _client = this._client;
    if (typeof _client['core'] == 'string') {
      _client.path += '/' + _client['core'];
    }
    _client.path += '/select?' + def_qp + "&" + query;
    // logger.debug(_client);
    executeQuery(_client, callback, context);
  };

  // operations based on initialization
  if (typeof init_opts == 'object') {
    _.extend(defaultSolrClient, init_opts);
    this.setClient(defaultSolrClient);
  } else {
    this._client = defaultSolrClient;
  }

  return this;
};

module.exports = solrClient;
