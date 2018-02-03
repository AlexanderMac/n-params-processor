'use strict';

const NumberParser = require('./number-parser');

class FloatParser extends NumberParser {
  static parse(params) {
    let instance = new FloatParser(params);
    return instance.parse();
  }

  _convert() {
    this.val = parseFloat(this.val);
  }
}

module.exports = FloatParser;
