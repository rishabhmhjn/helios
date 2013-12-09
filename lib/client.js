/**
 * @author rishabhmhjn
 * @modified hguillermo
 */

var helios = require('./');
var querystring = require('querystring');
var http = require("http");
var _ = require("underscore");

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
      _client.path += '/update'
          + (commit == true ? '?commit=true' : '?commit=false');
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

  this.addDocs = function(solrdocs, commit, callback) {
    if ((solrdocs != null) && solrdocs.length > 0) {
      var _client = _.clone(this._client);
      _client.method = 'POST';
      if (typeof _client['core'] == 'string') {
        _client.path += '/' + _client['core'];
      }
      _client.path += '/update'
          + (commit == true ? '?commit=true' : '?commit=false');
      _client.data = '<add>';
      _.each(solrdocs, function(doc) {
        if (doc instanceof helios.document) {
          return _client.data += doc.toXML();
        } else {
          return callback(new SolrClientException("Bad Solr Document", doc));
        }
      });
      _client.data += '</add>';
      _client.headers = {
        'Content-Length': Buffer.byteLength(_client.data),
        'Content-Type': 'application/xml'
      };
      return executeQuery(_client, callback);
    }
  };

  this.updateDoc = function(doc, commit, callback) {
    // ---------------------------------------------------------------------------------------------------------------------
    // NOTE: Solr has a bug. If there are not fields to update or delete Solr
    // will replace the whole document with the one
    // we defined in the parameter doc.
    // ---------------------------------------------------------------------------------------------------------------------
    // check if there is at least one set or add here ==> doc.toXML()
    if (Object.keys(doc.getFieldUpdates()).length === 0) { return callback('There are no fields to update. Please define the fields to update using the setFieldUpdate method.'); }

    this.addDoc(doc, commit, callback);
  };

  this.deleteDoc = function(id, values, commit, callback) {
    var data = '';
    if (Array.isArray(values)) {
      data = '<update>';
      _.each(values, function(value, i, list) {
        data += '<delete><' + id + '>' + value + '</' + id + '></delete>';
      });
      data += '</update>';
    } else {
      data = '<delete><' + id + '>' + values + '</' + id + '></delete>';
    }

    var _client = _.clone(this._client);
    _client.method = 'POST';
    if (typeof _client['core'] == 'string') {
      _client.path += '/' + _client['core'];
    }
    _client.path += '/update'
        + (commit == true ? '?commit=true' : '?commit=false');
    _client.data = data;
    _client.headers = {
      'Content-Length' : Buffer.byteLength(_client.data),
      'Content-Type' : 'application/xml'
    };

    executeQuery(_client, callback);
  };

  this.deleteDocByQuery = function(query, commit, maxAffected, callback) {
    // limit the number of documents deleted by the query
    maxAffected = (typeof maxAffected === "undefined") ? 100 : maxAffected;

    var self = this;

    // before to delete the documents check how many we are going to delete
    var queryBuilder = new helios.queryBuilder();
    this
        .select(
            queryBuilder.simpleQuery({
              op : '',
              df : '',
              q : query,
              start : 0,
              rows : 0
            }),
            function(err, res) {
              if (err) {
                return callback(err);
              } else {
                var totalAffected = -1;

                // find how many documents we are going to delete
                try {
                  totalAffected = JSON.parse(res).response.numFound;
                } catch (e) {
                  return callback(e);
                }

                // check if we can run the delete query (maxAffected=0: no limit
                // when deleting documents)
                if (totalAffected === 0) {
                  return callback('There are no documents to delete. Please check your delete query ('
                      + query + ')');
                } else if (totalAffected > maxAffected && maxAffected !== 0) { return callback('The number of documents to delete ('
                    + totalAffected
                    + ') exceeded the maximum permitted ('
                    + maxAffected + ')'); }

                // delete the documents...
                var _client = _.clone(self._client);
                _client.method = 'POST';
                if (typeof _client['core'] == 'string') {
                  _client.path += '/' + _client['core'];
                }
                _client.path += '/update'
                    + (commit == true ? '?commit=true' : '?commit=false');
                _client.data = '<delete><query>' + query + '</query></delete>';
                _client.headers = {
                  'Content-Length' : Buffer.byteLength(_client.data),
                  'Content-Type' : 'application/xml'
                };

                executeQuery(_client, callback);
              }
            });
  };

  // operations based on initialization
  this.setClient(init_opts);

  return this;
};

module.exports = solrClient;
