'use strict';

const _ = require('lodash');

let _ErrorType = Error;

class BaseParser {
  static registerErrorType(ErrorType) {
    _ErrorType = ErrorType;
  }

  constructor({ val, name, required, min, max, allowed } = {}) {
    this.val = val;
    this.name = name;
    this.required = required;
    this.min = min;
    this.max = max;
    this.allowed = allowed;
  }

  parse() {
    this._validateRequired();
  }

  _validateRequired() {
    if (this.required && _.isNil(this.val)) {
      this._throwIncorrectParamError(`${this.name} is required`);
    }
  }

  _validateAllowed() {
    if (this.allowed && !_.includes(this.allowed, this.val)) {
      this._throwIncorrectParamError(`${this.name} is incorrect, must be one of ${this.allowed}`);
    }
  }

  _throwIncorrectParamError(message) {
    throw new _ErrorType(message);
  }
}

module.exports = BaseParser;
