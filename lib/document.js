/**
 * @author rishabhmhjn
 * @modified hguillermo
 */

var utils = require('./utils');

var solrDoc = function() {
  var documentBoost = false;
  var fields = {};
  var fieldBoosts = {};
  var fieldUpdates = {};
  var fieldDeletes = {};

  this.getBoost = function() {
    return documentBoost;
  };

  this.setBoost = function(boost) {
    boost = parseFloat(boost);

    if (boost > 0.0) {
      documentBoost = boost;
    } else {
      documentBoost = false;
    }
    return this;
  };

  this.addField = function(key, value, boost) {
    if (typeof boost == 'undefined') {
      boost = false;
    }

    if (typeof fields[key] == 'undefined') {
      fields[key] = [];
    } else if (!Array.isArray(fields[key])) {
      fields[key] = [ fields[key] ];
    }

    if (this.getFieldBoost(key) === false) {
      // boost not already set, set it now
      this.setFieldBoost(key, boost);
    } else if (parseFloat(boost) > 0.0) {
      // multiply passed boost with current field boost - similar to SolrJ
      // implementation
      fieldBoosts[key] *= parseFloat(boost);
    }

    fields[key].push(value);
    return this;
  };

  this.setMultiValue = function(key, value, boost) {
    this.addField(key, value, boost);
    return this;
  };

  this.getField = function(key) {
    return (typeof fields[key] != "undefined") ? fields[key] : false;
  };

  this.setField = function(key, value, boost, update) {
    if (typeof boost == 'undefined') {
      boost = false;
    }
    if (typeof update !== 'undefined') {
      this.setFieldUpdate(key, update);
    }

    fields[key] = value;
    this.setFieldBoost(key, boost);
    return this;
  };

  this.getFieldBoost = function(key) {
    return (typeof fieldBoosts[key] != "undefined") ? fieldBoosts[key] : false;
  };

  this.setFieldBoost = function(key, boost) {
    boost = parseFloat(boost);

    if (boost > 0.0) {
      fieldBoosts[key] = boost;
    } else {
      fieldBoosts[key] = false;
    }
    return this;
  };

  this.getFieldBoosts = function() {
    return fieldBoosts;
  };

  this.getFieldUpdate = function(key) {
    return (typeof fieldUpdates[key] != "undefined") ? fieldUpdates[key]
        : false;
  };

  this.setFieldUpdate = function(key, update) {
    var options = {
      set : true,
      add : true
    };
    if (typeof update == 'undefined') {
      update = 'add';
    }
    if (!options[update]) {
      // check solr documentation. http://wiki.apache.org/solr/UpdateXmlMessages
      throw 'Update value not allowed. It must be "set" or "add"';
    }

    fieldUpdates[key] = update;
    return this;
  };

  this.getFieldUpdates = function() {
    return fieldUpdates;
  };

  this.getFieldDelete = function(key) {
    return (typeof fieldDeletes[key] != "undefined") ? fieldDeletes[key]
        : false;
  };

  /*
   * Based on Solr documentation to delete a field:
   * http://wiki.apache.org/solr/UpdateXmlMessages <add> <doc> <field
   * name="employeeId">05991</field> <field name="skills" update="set"
   * null="true" /> </doc> </add>
   */
  this.setFieldDelete = function(key) {
    if (typeof key == 'undefined') { throw 'Key value can not be undefined.'; }

    this.setField(key, '');
    this.setFieldUpdate(key, 'set');
    fieldDeletes[key] = 'true';
    return this;
  };

  this.getFieldDeletes = function() {
    return fieldDeletes;
  };

  this.clear = function(options) {
    documentBoost = false;
    fieldBoosts = fields = {};
    return this;
  };

  this.toXML = function() {
    var data = '<doc>';

    for ( var o in fields) {
      if (Array.isArray(fields[o])) {
        for ( var oo in fields[o]) {
          data += '<field name="'
              + o
              + '"'
              + (this.getFieldUpdate(o) ? ' update="' // new
                  + this.getFieldUpdate(o) + '"' : '') // new
              + (this.getFieldDelete(o) ? ' null="' // new
                  + this.getFieldDelete(o) + '"' : '') // new
              + (this.getFieldBoost(o) ? ' boost="'
                  + parseFloat(this.getFieldBoost(o)) + '"' : '') + '>';
          data += utils.escapeXML(fields[o][oo]);
          data += '</field>';
        }
      } else {
        data += '<field name="'
            + o
            + '" '
            + (this.getFieldUpdate(o) ? ' update="' // new
                + this.getFieldUpdate(o) + '"' : '') // new
            + (this.getFieldDelete(o) ? ' null="' // new
                + this.getFieldDelete(o) + '"' : '') // new
            + (this.getFieldBoost(o) ? ' boost="'
                + parseFloat(this.getFieldBoost(o)) + '"' : '') + '>';
        data += utils.escapeXML(fields[o]);
        data += '</field>';
      }
    }

    data += '</doc>';

    return data;
  };

};

module.exports = solrDoc;
