'use strict';

const NumberParser = require('./number-parser');

class IntParser extends NumberParser {
  static parse(params) {
    let instance = new IntParser(params);
    return instance.parse();
  }

  _convert() {
    this.val = parseInt(this.val);
  }
}

module.exports = IntParser;
