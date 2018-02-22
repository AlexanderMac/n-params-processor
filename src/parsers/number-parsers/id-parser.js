'use strict';

const NumberParser = require('./number-parser');

class IdParser extends NumberParser {
  static getInstance(params) {
    return new IdParser(params);
  }

  static parse(params) {
    return IdParser.getInstance(params).parse();
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
