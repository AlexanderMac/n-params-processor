'use strict';

const _          = require('lodash');
const BaseParser = require('../base-parser');

class RegexpParser extends BaseParser {
  static getInstance(params) {
    return new RegexpParser(params);
  }

  static parse(params) {
    return RegexpParser.getInstance(params).parse();
  }

  constructor(params) {
    super(params);
    this.pattern = params.pattern;
    this.errorMessage = `There is no match between regexp and ${this.name}`;
  }

  parse() {
    let isNilOrDefault = super.parse();
    if (isNilOrDefault) {
      return this.val;
    }

    this._validate();

    return this.val;
  }

  _validate() {
    if (!_.isString(this.val) || !this.pattern.test(this.val)) {
      this._throwIncorrectParamError(this.errorMessage);
    }
  }
}

module.exports = RegexpParser;
