'use strict';

const NumberParser = require('./number-parser');

class FloatParser extends NumberParser {
  static parse(opts) {
    let instance = new FloatParser(opts);
    return instance.parse();
  }

  _convert() {
    this.val = parseFloat(this.val);
  }
}

module.exports = FloatParser;
