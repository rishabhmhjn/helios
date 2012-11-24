/**
 * @author rishabhmhjn
 */

var utils = require("./utils"), _ = require('underscore'), logger = require(
    'nlogger').logger(module);

/**
 * @returns {queryBuilder}
 */
function queryBuilder() {

  /**
   * @type object
   */
  var query = {
    q : "*:*"
  };

  this.get = function() {
    return utils.serializeQueryObj(query);
  };

  this.simpleQuery = function(options) {
    if (typeof options.op !== 'string'
        || (options.op.toUpperCase() != 'AND' && options.op.toUpperCase() != 'OR')) {
      options.op = 'AND';
    }

    var qStr = '{!q.op=' + options.op.toUpperCase()
        + (typeof options.df !== 'undefined' ? ' df=' + options.df : '') + '}'
        + options.keywords;

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
    if (_.isNaN(parseInt(options['facet.limit']))) options['facet.limit'] = 10;

    _.extend(query, options);
  };

};

module.exports = queryBuilder;
