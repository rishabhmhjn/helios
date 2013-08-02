/**
 * @author rishabhmhjn
 */

var querystring = require('querystring'), utils = require("./utils"), _ = require('underscore');

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
    "json.nl" : "map",
    rows : 10
  };

  /**
   * Get the query string
   *
   * @param void
   * @returns string
   */
  this.toString = function() {
    return querystring.stringify(query);
  };

  this.query = function(options) {
    if (typeof options != 'object') {
      {
        throw new Error("An object must be passed to the query function",
            options);
      }
    }
    _.extend(query, options);
    return this;
  };

  this.simpleQuery = function(options) {
    if (typeof options != 'object') {
      {
        throw new Error(
            "Bad options have been passed to the simpleQuery function", options);
      }
    }
    var qStr = '';

    if (typeof options.op !== 'string'
        || (options.op.toUpperCase() != 'AND' && options.op.toUpperCase() != 'OR')) {
      options.op = 'AND';
    }

    options.q = (typeof options.q == 'undefined') ? "*:*" : options.q;

    qStr = '{!q.op='
        + options.op.toUpperCase()
        + ((typeof options.df == 'string' && options.df != '') ? ' df='
            + String(options.df) : '') + '}' + String(options.q);

    delete options.op;
    delete options.df;

    options.q = qStr;

    _.extend(query, options);
    return this;
  };

  this.facetQuery = function(options) {
    if (typeof options != 'object') { throw new Error(
        "An object must be passed as an argument for facetQuery"); }

    if (options['facet'] !== true) options['facet'] = true;

    if (typeof options['facet.sort'] != 'string')
      options['facet.sort'] = 'count';
    if (isNaN(parseInt(options['facet.limit']))) options['facet.limit'] = 10;

    _.extend(query, options);

    return this;
  };

};

module.exports = queryBuilder;
