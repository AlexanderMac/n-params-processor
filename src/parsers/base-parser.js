'use strict';

const _ = require('lodash');

let _ErrorType = Error;

class BaseParser {
  static registerErrorType(ErrorType) {
    _ErrorType = ErrorType;
  }

  constructor({ val, name, required, def, min, max, allowed } = {}) {
    this.val = val;
    this.name = name;
    this.required = !!required;
    if (!_.isNil(def)) {
      this.def = def;
    }
    if (!_.isNil(min)) {
      this.min = min;
    }
    if (!_.isNil(max)) {
      this.max = max;
    }
    if (!_.isNil(allowed)) {
      this.allowed = allowed;
    }
  }

  parse() {
    this._validateRequired();

    if (_.isNil(this.val)) {
      this.val = this.def || this.val;
      return true;
    }
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
