'use strict';

const NumberParser = require('./number-parser');

class IntParser extends NumberParser {
  static parse(opts) {
    let instance = new IntParser(opts);
    return instance.parse();
  }

  _convert() {
    this.val = parseInt(this.val);
  }
}

module.exports = IntParser;
