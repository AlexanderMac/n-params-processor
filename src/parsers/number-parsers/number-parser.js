'use strict';

const _          = require('lodash');
const BaseParser = require('../base-parser');

class NumberParser extends BaseParser {
  static parse(params) {
    let instance = new NumberParser(params);
    return instance.parse();
  }

  parse() {
    let isNilOrDefault = super.parse();
    if (isNilOrDefault) {
      return this.val;
    }

    this._convert();
    this._validateNumber();
    this._validateAllowed();
    this._validateMin();
    this._validateMax();

    return this.val;
  }

  _convert() {
    this.val = _.toNumber(this.val);
  }

  _validateNumber() {
    if (_.isNaN(this.val)) {
      this._throwIncorrectParamError(`${this.name} must be a number`);
    }
  }

  _validateMin() {
    if (!_.isNil(this.min) && this.val < this.min) {
      this._throwIncorrectParamError(`${this.name} must be greater than or equal to ${this.min}`);
    }
  }

  _validateMax() {
    if (!_.isNil(this.max) && this.val > this.max) {
      this._throwIncorrectParamError(`${this.name} must be less than or equal to ${this.max}`);
    }
  }
}

module.exports = NumberParser;
