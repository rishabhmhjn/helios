/**
 * @author rishabhmhjn
 */

var http = require("http"), _ = require("underscore"), logger = require(
    'nlogger').logger(module);
;

// var solrResponseDoc = function(doc) {
// this.doc = doc;
//
// this.get = function(key) {
// if (typeof this.doc[key] == "undefined") {
// return false;
// } else {
// return this[key];
// }
// };
//
// this.fields = _.keys(doc);
//
// return this;
// };

/**
 * @param message
 * @param options
 * @returns {SolrClientException}
 */

var solrClient = module.exports = function(init_options) {
  var defaultSolrClient = {
    host : '127.0.0.1',
    port : '8983',
    core : '',
    path : '/solr',
    method : 'GET'
  };

  // defining methods
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

  /**
   * serialize function to convert object into query params
   * 
   * @see http://stackoverflow.com/a/1714899/842214
   */
  var serializeObj = function(obj, prefix) {
    var str = [];
    for ( var p in obj) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push(typeof v == "object" ? serializeObj(v, k)
          : encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
    return str.join("&");
  };

  this.select = function(options, callback, context) {
    var def_qp = serializeObj({
      omitHeader : true,
      indent : 'off',
      wt : "json"
    });
    var query = '';
    if (typeof options == 'string') {
      query = options;
    } else {
      query = serializeObj(options);
    }

    var _client = this._client;
    _client.path += '/select?' + def_qp + "&" + query;
    executeQuery(_client, callback, context);
  };

  // operations based on initialization
  if (typeof init_options != 'undefined') {
    this.setClient(init_options);
  } else {
    this._client = defaultSolrClient;
  }

  return this;
};

module.exports = solrClient;
