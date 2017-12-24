'use strict';

const RegexpParser = require('./regexp-parser');

class ObjectIdParser extends RegexpParser {
  static parse(opts) {
    let instance = new ObjectIdParser(opts);
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
