'use strict';

const _          = require('lodash');
const moment     = require('moment');
const BaseParser = require('./base-parser');

class DateParser extends BaseParser {
  static parse(params) {
    let instance = new DateParser(params);
    return instance.parse();
  }

  constructor(params) {
    super(params);
    this.format = params.format || moment.defaultFormat;
    if (this.min) {
      this.min = moment.isMoment(params.min) ? params.min : moment(params.min, this.format);
    }
    if (this.max) {
      this.max = moment.isMoment(params.max) ? params.max : moment(params.max, this.format);
    }
  }

  parse() {
    super.parse();

    if (_.isNil(this.val)) {
      return this.val;
    }

    this.val = moment(this.val, this.format);
    this._validateMomentDate();
    this._validateMin();
    this._validateMax();

    return this.val;
  }

  _validateMomentDate() {
    if (!this.val.isValid()) {
      this._throwIncorrectParamError(`${this.name} must be a valid date`);
    }
  }

  _validateMin() {
    if (!_.isNil(this.min) && this.val < this.min) {
      this._throwIncorrectParamError(`${this.name} must be greater than or equal to ${this.min.format(this.format)}`);
    }
  }

  _validateMax() {
    if (!_.isNil(this.max) && this.val > this.max) {
      this._throwIncorrectParamError(`${this.name} must be less than or equal to ${this.max.format(this.format)}`);
    }
  }
}

module.exports = DateParser;
