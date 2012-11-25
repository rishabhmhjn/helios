/**
 * @author rishabhmhjn
 */

var utils = require("./utils"), _ = require('underscore'), logger = require(
    'nlogger').logger(module), querystring = require('querystring');

/**
 * @returns {queryBuilder}
 */
function queryBuilder() {

  /**
   * Default query parameters
   * 
   * @type object
   */
  var query = {
    q : "*:*",
    omitHeader : true,
    indent : 'off',
    wt : "json",
    "json.nl" : "map"
  };

  /**
   * Get the query string
   * 
   * @param void
   * @returns string
   */
  this.get = function() {
    return querystring.stringify(query);
  };

  this.simpleQuery = function(options) {
    var qStr;
    if (typeof options == 'string') {
      qStr = options;
    } else {
      if (typeof options.op !== 'string'
          || (options.op.toUpperCase() != 'AND' && options.op.toUpperCase() != 'OR')) {
        options.op = 'AND';
      }

      qStr = '{!q.op=' + options.op.toUpperCase()
          + (typeof options.df !== 'undefined' ? ' df=' + options.df : '')
          + '}' + options.keywords;
    }

    _.extend(query, {
      q : qStr
    });
    return this;
  };

  this.facetQuery = function(options) {
    if (typeof options != 'object') return false;
    if (options['facet'] !== true) options['facet'] = true;

    if (typeof options['facet.sort'] != 'string')
      options['facet.sort'] = 'count';
    if (isNaN(parseInt(options['facet.limit']))) options['facet.limit'] = 10;

    _.extend(query, options);

    return this;
  };

};

module.exports = queryBuilder;
