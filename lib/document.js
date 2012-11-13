/**
 * 
 */

var _ = require('underscore'), logger = require('nlogger').logger(module);

var _document = module.exports = function() {
  this.documentBoost = false;

  this.fields = {};

  this.fieldBoosts = {};

  this.getBoost = function() {
    return this.documentBoost;
  };

  this.setBoost = function(boost) {
    boost = parseFloat(boost);

    if (boost > 0.0) {
      this.documentBoost = boost;
    } else {
      this.documentBoost = false;
    }
  };

  this.addField = function(key, value, boost) {
    if (typeof boost == 'undefined') {
      boost = false;
    }

    if (typeof this.fields[key] == 'undefined') {
      this.fields[key] = [];
    } else if (!_.isArray(this.fields[key])) {
      this.fields[key] = [ this.fields[key] ];
    }

    if (this.getFieldBoost(key) === false) {
      // boost not already set, set it now
      this.setFieldBoost(key, boost);
    } else if (parseFloat(boost) > 0.0) {
      // multiply passed boost with current field boost - similar to SolrJ
      // implementation
      this.fieldBoosts[key] *= parseFloat(boost);
    }

    this.fields[key].push(value);
  };

  this.setMultiValue = function(key, value, boost) {
    this.addField(key, value, boost);
  };

  this.setField = function(key, value, boost) {
    if (typeof boost == 'undefined') {
      boost = false;
    }
    this.fields[key] = value;
    this.setFieldBoost(key, boost);
  };

  this.getFieldBoost = function(key) {
    return (typeof this.fieldBoosts[key] != "undefined") ? this.fieldBoosts[key]
        : false;
  };

  this.setFieldBoost = function(key, boost) {
    boost = parseFloat(boost);

    if (boost > 0.0) {
      this.fieldBoosts[key] = boost;
    } else {
      this.fieldBoosts[key] = false;
    }
  };

  this.getFieldBoosts = function() {
    return this.fieldBoosts;
  };

};

_document.prototype.clear = function(options) {
  logger.debug(arguments);
  this.documentBoost = false;
  this.fieldBoosts = this.fields = {};

};
