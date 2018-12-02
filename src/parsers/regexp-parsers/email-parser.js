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
    // eslint-disable-next-line max-len
    return /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
  }
}

module.exports = EmailParser;
