'use strict';

const NumberParser = require('./number-parser');

class IdParser extends NumberParser {
  static parse(params) {
    let instance = new IdParser(params);
    return instance.parse();
  }

  constructor(params) {
    super(params);
    this.min = this.min >= 1 ? this.min : 1;
  }

  _convert() {
    this.val = parseInt(this.val);
  }
}

module.exports = IdParser;
