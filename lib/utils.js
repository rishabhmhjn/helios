/**
 * 
 */

var logger = require('nlogger').logger(module), _ = require('underscore');

var utils = {

  /**
   * serialize function to convert object into query params
   * 
   * @see http://stackoverflow.com/a/1714899/842214
   */
  serializeObj : function(obj, prefix) {
    var str = [];
    for ( var p in obj) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push(typeof v == "object" ? this.serializeObj(v, k)
          : encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
    return str.join("&");
  },

  serializeQueryObj : function(obj, prefix) {
    var str = [];
    for ( var p in obj) {
      var k = prefix ? prefix : p, v = obj[p];
      str.push(_.isArray(v) ? this.serializeQueryObj(v, k)
          : encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
    return str.join("&");
  }

};

module.exports = utils;
