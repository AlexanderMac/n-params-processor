'use strict';

const _          = require('lodash');
const BaseParser = require('./base-parser');

class StringParser extends BaseParser {
  static parse(params) {
    let instance = new StringParser(params);
    return instance.parse();
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
