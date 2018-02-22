'use strict';

const _          = require('lodash');
const BaseParser = require('./base-parser');

class StringParser extends BaseParser {
  static getInstance(params) {
    return new StringParser(params);
  }

  static parse(params) {
    return StringParser.getInstance(params).parse();
  }

  parse() {
    let isNilOrDefault = super.parse();
    if (isNilOrDefault) {
      return this.val;
    }

    this.val = this.val.toString();
    this._validateAllowed();
    this._validateMin();
    this._validateMax();

    return this.val;
  }

  _validateMin() {
    if (!_.isNil(this.min) && this.val.length < this.min) {
      this._throwIncorrectParamError(`${this.name} must have at least ${this.min} characters`);
    }
  }

  _validateMax() {
    if (!_.isNil(this.max) && this.val.length > this.max) {
      this._throwIncorrectParamError(`${this.name} must have no more than ${this.max} characters`);
    }
  }
}

module.exports = StringParser;
