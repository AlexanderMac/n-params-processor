const _ = require('lodash');
const moment = require('moment');
const BaseParser = require('./base-parser');

class DateParser extends BaseParser {
  static getInstance(params) {
    return new DateParser(params);
  }

  static parse(params) {
    return DateParser.getInstance(params).parse();
  }

  constructor(params) {
    super(params);
    this.format = params.format || moment.defaultFormat;
    this.formatRes = params.formatRes;
    if (this.min) {
      this.min = moment.isMoment(this.min) ? this.min : moment(this.min, this.format);
    }
    if (this.max) {
      this.max = moment.isMoment(this.max) ? this.max : moment(this.max, this.format);
    }
  }

  parse() {
    let isNilOrDefault = super.parse();
    if (isNilOrDefault) {
      return this.val;
    }

    this.val = moment(this.val, this.format);
    this._validateMomentDate();
    this._validateMin();
    this._validateMax();
    return this._getResult();
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

  _getResult() {
    if (!this.formatRes || !this.val) {
      return this.val;
    }
    if (this.formatRes === Date) {
      return this.val.toDate();
    }
    return this.val.format(this.formatRes);
  }
}

module.exports = DateParser;
