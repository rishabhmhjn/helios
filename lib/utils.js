/**
 * 
 */

var utils = {

  /**
   * @param str
   * @returns String
   * @see http://stackoverflow.com/a/7918944/842214
   */
  escapeXML : function(str) {
    return str.replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g,
        '<').replace(/&amp;/g, '&');
  }
};

module.exports = utils;
