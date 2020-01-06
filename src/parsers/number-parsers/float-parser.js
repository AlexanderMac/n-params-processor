const NumberParser = require('./number-parser');

class FloatParser extends NumberParser {
  static getInstance(params) {
    return new FloatParser(params);
  }

  static parse(params) {
    return FloatParser.getInstance(params).parse();
  }

  _convert() {
    this.val = parseFloat(this.val);
  }
}

module.exports = FloatParser;
