'use strict';

const RegexpParser = require('./regexp-parser');

class EmailParser extends RegexpParser {
  static getInstance(params) {
    return new EmailParser(params);
  }

  static parse(params) {
    return EmailParser.getInstance(params).parse();
  }

  constructor(params) {
    super(params);
    this.errorMessage = `${this.name} must be a valid email address`;
  }

  _getRegexp() {
    return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  }
}

module.exports = EmailParser;
