'use strict';

const _          = require('lodash');
const BaseParser = require('../base-parser');

class RegexpParser extends BaseParser {
  static parse(opts) {
    let instance = new RegexpParser(opts);
    return instance.parse();
  }

  constructor(params) {
    super(params);
    this.errorMessage = `There is no match between regexp and ${this.name}`;
  }

  parse() {
    super.parse();

    if (_.isNil(this.val)) {
      return this.val;
    }

    this._validate();

    return this.val;
  }

  _validate() {
    if (!_.isString(this.val) || !this._getRegexp().test(this.val)) {
      this._throwIncorrectParamError(this.errorMessage);
    }
  }

  _getRegexp() {
    return /^[a-zA-Z]+$/;
  }
}

module.exports = RegexpParser;
