/**
 * @author rishabhmhjn
 */

var helios = require("../"), querystring = require('querystring'), logger = require(
    'nlogger').logger(module);

exports.init = function(test) {
  var qb = new helios.queryBuilder();
  test.ok(qb);
  test.ok(qb instanceof helios.queryBuilder);
  test.done();
};

exports.simpleQuery = {
  setUp : function(callback) {
    this.qb = new helios.queryBuilder();
    callback();
  },
  tearDown : function(callback) {
    // clean up
    this.qb = null;
    callback();
  },

  "no options are passed" : function(test) {
    var self = this;
    test.throws(function() {
      self.qb.simpleQuery();
    }, Error, 'This will throw an Exception!');
    test.done();
  },

  "an empty object is passed as options" : function(test) {
    var self = this;

    test.doesNotThrow(function() {
      self.qb.simpleQuery({});
    }, Error, 'Passing empty object does not throw an exception.');

    test.ok(this.qb);
    test.done();
  },

  "op as an option" : {
    "no op" : function(test) {
      var self = this;
      test.doesNotThrow(function() {
        self.qb.simpleQuery({
          q : "keyword"
        });
      }, Error);

      test.ok(this.qb);
      test.notEqual(this.qb.toString().search(querystring.escape("op=AND")),
          -1, "op should be set as AND");

      test.done();
    },

    "dummy string" : function(test) {
      var self = this;
      test.doesNotThrow(function() {
        self.qb.simpleQuery({
          q : "keyword0",
          op : "dummy"
        });
      }, Error);

      test.ok(this.qb);
      test.notEqual(this.qb.toString().search(querystring.escape("op=AND")),
          -1, "op should be set as AND");

      test.done();
    },

    "integer" : function(test) {
      var self = this;
      test.doesNotThrow(function() {
        self.qb.simpleQuery({
          q : "keyword1",
          op : 1212
        });
      }, Error);

      test.ok(this.qb);
      test.notEqual(this.qb.toString().search(querystring.escape("op=AND")),
          -1, "op should be set as AND");

      test.done();
    },

    "boolean" : function(test) {
      var self = this;
      test.doesNotThrow(function() {
        self.qb.simpleQuery({
          q : "keyword2",
          op : false
        });
      }, Error);

      test.ok(this.qb);
      test.notEqual(this.qb.toString().search(querystring.escape("op=AND")),
          -1, "op should be set as AND");

      test.done();
    },

    "op=OR" : function(test) {
      var self = this;
      test.doesNotThrow(function() {
        self.qb.simpleQuery({
          q : "keyword3",
          op : "or"
        });
      }, Error);

      test.ok(this.qb);
      test.notEqual(this.qb.toString().search(querystring.escape("op=OR")), -1,
          "op should be set as OR");

      test.done();

    },

    "op=AND" : function(test) {
      var self = this;
      test.doesNotThrow(function() {
        self.qb.simpleQuery({
          q : "keyword4",
          op : "and"
        });
      }, Error);

      test.ok(this.qb);
      test.notEqual(this.qb.toString().search(querystring.escape("op=AND")),
          -1, "op should be set as AND");

      test.done();

    }
  },

  "q as an option" : {
    "string" : function(test) {
      var self = this;

      var keywordStr = "keyword string";
      test.doesNotThrow(function() {
        self.qb.simpleQuery({
          q : keywordStr,
          op : "or"
        });
      }, Error);

      test.ok(this.qb);
      test.notEqual(this.qb.toString().search(
          querystring.escape("}" + keywordStr)), -1, "keyword string : '"
          + keywordStr + "' should be set");

      test.done();

    },

    "boolean" : function(test) {
      var self = this;

      var keywordStr = true;
      test.doesNotThrow(function() {
        self.qb.simpleQuery({
          q : keywordStr,
          op : "or"
        });
      }, Error);

      test.ok(this.qb);
      test.notEqual(this.qb.toString().search(
          querystring.escape("}" + keywordStr)), -1, "keyword string : '"
          + keywordStr + "' should be set");

      test.done();
    },

    "integer" : function(test) {
      var self = this;

      var keywordStr = 121212;
      test.doesNotThrow(function() {
        self.qb.simpleQuery({
          q : keywordStr,
          op : "or"
        });
      }, Error);

      test.ok(this.qb);
      test.notEqual(this.qb.toString().search(
          querystring.escape("}" + keywordStr)), -1, "keyword string : '"
          + keywordStr + "' should be set");

      test.done();
    }
  },

  "df as an option" : {
    "empty string" : function(test) {
      var self = this;

      var keywordStr = "keyword";
      test.doesNotThrow(function() {
        self.qb.simpleQuery({
          q : keywordStr,
          op : "and",
          df : ''
        });
      }, Error);

      test.ok(this.qb);
      test
          .equal(this.qb.toString().search(querystring.escape("df=")), -1,
              "In case of empty df as empty string, the df value should not be set");

      test.done();
    },

    "fields" : function(test) {
      var self = this;

      var keywordStr = "keyword";
      var df = "field_name";
      test.doesNotThrow(function() {
        self.qb.simpleQuery({
          q : keywordStr,
          op : "and",
          df : df
        });
      }, Error);

      test.ok(this.qb);
      test
          .notEqual(this.qb.toString().search(querystring.escape("df=" + df)),
              -1,
              "In case of empty df as empty string, the df value should not be set");

      test.done();
    }
  }
};

exports.query = {
  setUp : function(callback) {
    this.qb = new helios.queryBuilder();
    callback();
  },
  tearDown : function(callback) {
    // clean up
    this.qb = null;
    callback();
  },

  "no argument" : function(test) {
    var self = this;

    test.throws(function() {
      self.qb.query();
    }, Error);

    test.done();
  },

  "integer as an argument" : function(test) {
    var self = this;

    test.throws(function() {
      self.qb.query(1111);
    }, Error);

    test.done();
  },

  "string as an argument" : function(test) {
    var self = this;

    test.throws(function() {
      self.qb.query("string");
    }, Error);

    test.done();
  },

  "boolean as an argument" : function(test) {
    var self = this;

    test.throws(function() {
      self.qb.query(false);
    }, Error);

    test.done();
  },

  "object as an argument" : function(test) {
    var self = this;

    var options = {
      q : "field1_name:keyword",
      qf : "+field2_name:keyword2 -field3_name:keyword3"
    };

    test.doesNotThrow(function() {
      self.qb.query(options);
    }, Error);

    test.ok(this.qb);
    test.equal(querystring.parse(this.qb.toString()).qf, options.qf,
        "query filter should be set in the builder");
    test.equal(querystring.parse(this.qb.toString()).q, options.q,
        "query keywords should be set in the builder");

    test.done();
  }
};

exports.facetQuery = {
  setUp : function(callback) {
    this.qb = new helios.queryBuilder();
    callback();
  },
  tearDown : function(callback) {
    // clean up
    this.qb = null;
    callback();
  },

  "string as an argument" : function(test) {
    var self = this;

    var options = "string";

    test.throws(function() {
      self.qb.facetQuery(options);
    }, Error);

    test.done();
  },

  "integer as an argument" : function(test) {
    var self = this;
    var options = 111111;

    test.throws(function() {
      self.qb.query(options);
    }, Error);

    test.done();
  },

  "object as an argument" : function(test) {
    var self = this;

    var options = {
      "facet" : 'true',
      "facet.date" : 'timestamp',
      "facet.date.start" : 'NOW/DAY-5DAYS',
      "facet.date.end" : 'NOW/DAY+1DAY',
      "facet.date.gap" : '+1DAY'

    };

    test.doesNotThrow(function() {
      self.qb.facetQuery(options);
    }, Error);

    var qStr = querystring.parse(this.qb.toString());

    test.ok(this.qb);
    test.ok(qStr["facet"]);
    test.equal(qStr["facet.sort"], "count",
        "The default facet.sort value is count");
    test.equal(qStr["facet.limit"], 10, "The default facet.limit should 10");

    test.equal(qStr["facet.date"], 'timestamp');
    test.equal(qStr["facet.date.start"], 'NOW/DAY-5DAYS');
    test.equal(qStr["facet.date.end"], 'NOW/DAY+1DAY');
    test.equal(qStr["facet.date.gap"], '+1DAY');

    test.done();
  }

};
