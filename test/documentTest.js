/**
 * @author rishabhmhjn
 */

var helios = require("../"), logger = require('nlogger').logger(module);

exports.init = function(test) {
  var doc = new helios.document();

  test.ok(doc);
  test.ok(doc instanceof helios.document);
  test.equal(doc.getBoost(), false);
  test.equal(Object.keys(doc.getFieldBoosts()).length, 0);

  test.done();
};

exports.setBoost = {
  setUp : function(callback) {
    this.doc = new helios.document();
    callback();
  },
  tearDown : function(callback) {
    // clean up
    this.doc = null;
    callback();
  },

  "empty argument" : function(test) {
    this.doc.setBoost();
    test.ifError(this.doc.getBoost());
    test.done();
  },
  "string as an argument" : function(test) {
    this.doc.setBoost("abcdef");
    test.ifError(this.doc.getBoost());
    test.done();
  },
  "boolean as an argument" : function(test) {
    this.doc.setBoost(true);
    test.ifError(this.doc.getBoost());
    test.done();
  },
  "integer as an argument" : function(test) {
    this.doc.setBoost(12);
    test.strictEqual(this.doc.getBoost(), 12);
    test.done();
  },
  "float as an argument" : function(test) {
    this.doc.setBoost(12.212);
    test.strictEqual(this.doc.getBoost(), 12.212);
    test.done();
  },
  "integer string as an argument" : function(test) {
    this.doc.setBoost("12");
    test.strictEqual(this.doc.getBoost(), 12);
    test.done();
  },
  "float string as an argument" : function(test) {
    this.doc.setBoost("12.212");
    test.strictEqual(this.doc.getBoost(), 12.212);
    test.done();
  }
};

exports.setField = function(test) {
  var doc = new helios.document();

  doc.setField("field", "value");
  test.strictEqual(doc.getField("field"), "value");
  test.strictEqual(doc.getFieldBoost("field"), false);

  doc.setField("field2", "value2", 112.1);
  test.strictEqual(doc.getField("field2"), "value2");
  test.strictEqual(doc.getFieldBoost("field2"), 112.1);

  test.done();

};

exports.setMultiValue = function(test) {
  var doc = new helios.document();

  doc.setMultiValue("field", "value1", 1.5);
  test.equal(doc.getField("field")[0], "value1");
  test.strictEqual(doc.getFieldBoost("field"), 1.5);

  doc.setMultiValue("field", "value2", 1.5);
  test.equal(doc.getField("field")[1], "value2");
  test.strictEqual(doc.getFieldBoost("field"), 2.25);

  doc.setMultiValue("field", "value3", false);
  test.equal(doc.getField("field")[2], "value3");
  test.strictEqual(doc.getFieldBoost("field"), 2.25);

  test.done();
};

exports.clear = function(test) {
  var doc = new helios.document();

  doc.setBoost(12);
  test.strictEqual(doc.getBoost(), 12);

  doc.setMultiValue("field", "value1", 1.5);
  test.equal(doc.getField("field")[0], "value1");
  test.strictEqual(doc.getFieldBoost("field"), 1.5);

  doc.setMultiValue("field", "value2", 1.5);
  test.equal(doc.getField("field")[1], "value2");
  test.strictEqual(doc.getFieldBoost("field"), 2.25);

  doc.setField("setField1", "setFieldValue1");
  test.strictEqual(doc.getField("setField1"), "setFieldValue1");
  test.strictEqual(doc.getFieldBoost("setField1"), false);

  doc.setField("setField2", "setFieldValue2", 112.1);
  test.strictEqual(doc.getField("setField2"), "setFieldValue2");
  test.strictEqual(doc.getFieldBoost("setField2"), 112.1);

  doc.clear();

  test.strictEqual(doc.getBoost(), false);
  test.strictEqual(doc.getField("field"), false);
  test.strictEqual(doc.getField("setField1"), false);
  test.strictEqual(doc.getField("setField2"), false);

  test.done();
};

/**
 * TODO : test XML format and content
 */
