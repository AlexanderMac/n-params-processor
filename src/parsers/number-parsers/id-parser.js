'use strict';

const NumberParser = require('./number-parser');

class IdParser extends NumberParser {
  static parse(opts) {
    let instance = new IdParser(opts);
    return instance.parse();
  }

  constructor(opts) {
    super(opts);
    this.min = this.min >= 1 ? this.min : 1;
  }

  _convert() {
    this.val = parseInt(this.val);
  }
}

module.exports = IdParser;
