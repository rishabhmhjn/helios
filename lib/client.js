/**
 * @author rishabhmhjn
 */

/**
 * @param message
 * @param options
 * @returns {SolrClientException}
 */
function SolrClientException(message, options) {
  this.message = message;
  this.options = options;
  this.name = "SolrClientException";
}

var solrClient = module.exports = function(options) {
  var defaultSolrClient = {
    host : '127.0.0.1',
    port : '8983',
    core : '',
    path : '/solr'
  };

  if (typeof options != 'undefined') {
    if (typeof options.host == "undefined"
        || typeof options.port == "undefined"
        || typeof options.path == "undefined") {
      throw new SolrClientException("Bad Client Details", options);
    } else {
      this.client = options;
    }
  } else {
    this.client = defaultSolrClient;
  }
};
