'use strict';

const RegexpParser = require('./regexp-parser');

class ObjectIdParser extends RegexpParser {
  static parse(params) {
    let instance = new ObjectIdParser(params);
    return instance.parse();
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
