/**
 * @author rishabhmhjn
 */

var helios = require('./'), querystring = require('querystring'), http = require("http"), _ = require("underscore"), logger = require(
    'nlogger').logger(module);

/**
 * @param message
 * @param options
 * @returns {SolrClientException}
 */

var solrClient = function(init_opts) {
  this._client = {
    host : '127.0.0.1',
    port : '8983',
    core : null,
    path : '/solr'
  };

  var SolrClientException = function(message, options) {
    this.message = message;
    this.options = options;
    this.name = "SolrClientException";
  };

  this.SolrClientException = SolrClientException;

  // defining methods
  this.setClient = function(client) {
    if (typeof client == 'object') {
      if (typeof client.host != "string" || _.isNaN(parseInt(client.port))
          || typeof client.path != "string") { throw new SolrClientException(
          "Bad Client Details", client); }

      var _client = _.clone(client);

      /**
       * for proxy based http requests
       * 
       * @see http://stackoverflow.com/a/6781592/842214
       */
      if (typeof client.proxy == 'object') {
        if (typeof client.proxy.host != "undefined"
            && typeof client.proxy.port != "undefined") {
          _.extend(_client, {
            host : client.proxy.host,
            port : client.proxy.port,
            path : (client.port == 443 ? 'https://' : 'http://') + client.host
                + ':' + client.port + client.path
          });
          delete _client.proxy;
        }
      }
      _.extend(this._client, _client);
    }
    return this;
  };

  this.getClient = function() {
    return this._client;
  };

  function executeQuery(options, callback) {
    var _data = '';
    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        _data += chunk;
      });
      res.on("end", function() {
        if (res.statusCode != 200) {
          callback(_data);
        } else callback(null, _data);
      });
    }).on('error', function(e) {
      callback(e);
    });

    if (typeof options.timeout == 'number') {
      req.on('socket', function(socket) {
        socket.setTimeout(options.timeout);
        socket.on('timeout', function() {
          req.abort();
        });
      });
    }

    if (typeof options.data == 'string') {
      req.write(options.data);
    }
    req.end();
  }

  this.select = function(options, callback) {
    var query = '';
    if (options instanceof helios.queryBuilder) {
      query = options.toString();
    } else if (typeof options == 'string') {
      query = options;
    } else {
      query = querystring.stringify(options);
    }

    var _client = _.clone(this._client);
    _client.method = 'GET';
    if (typeof _client['core'] == 'string') {
      _client.path += '/' + _client['core'];
    }
    _client.path += '/select?' + query;
    executeQuery(_client, callback);
  };

  this.addDoc = function(doc, commit, callback) {
    if (doc instanceof helios.document) {
      var _client = _.clone(this._client);
      _client.method = 'POST';
      if (typeof _client['core'] == 'string') {
        _client.path += '/' + _client['core'];
      }
      _client.path += '/update' + (commit == true ? '?commit=true' : '');

      _client.data = '<add>' + doc.toXML() + '</add>';
      _client.headers = {
        'Content-Length' : Buffer.byteLength(_client.data),
        'Content-Type' : 'application/xml'
      };

      executeQuery(_client, callback);
    } else {
      throw new SolrClientException("Bad Solr Document", doc);
    }
  };

  // operations based on initialization
  this.setClient(init_opts);

  return this;
};

module.exports = solrClient;
