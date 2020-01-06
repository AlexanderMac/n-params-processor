const NumberParser = require('./number-parser');

class IntParser extends NumberParser {
  static getInstance(params) {
    return new IntParser(params);
  }

  static parse(params) {
    return IntParser.getInstance(params).parse();
  }

  _convert() {
    this.val = parseInt(this.val);
  }
}

module.exports = IntParser;
