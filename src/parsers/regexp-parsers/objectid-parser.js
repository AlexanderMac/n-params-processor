'use strict';

const RegexpParser = require('./regexp-parser');

class ObjectIdParser extends RegexpParser {
  static getInstance(params) {
    return new ObjectIdParser(params);
  }

  static parse(params) {
    return ObjectIdParser.getInstance(params).parse();
  }

  constructor(params) {
    super(params);
    this.errorMessage = `${this.name} must be a valid ObjectId`;
  }

  _getRegexp() {
    return /^[0-9a-fA-F]{24}$/;
  }
}

module.exports = ObjectIdParser;
