'use strict';

const _          = require('lodash');
const moment     = require('moment');
const validators = require('n-validators');

let _ErrorType = Error;

class ParamsProcessor {
  static registerErrorType(ErrorType) {
    _ErrorType = ErrorType;
  }

  constructor({ source, dest } = {}) {
    this.source = source;
    this.dest = dest;
  }

  /* TODO: not implemented
  // TODO: test it
  // TODO: implement it
  parse() {

  }
  */

  parseString({ source, name, allowed, min, max, required }) {
    let val = this._validateParamsAndGetValue({ source, name, required });
    if (_.isNil(val)) {
      return;
    }

    val = val.toString();
    if (allowed && !_.includes(allowed, val)) {
      this._throwUnprocessableRequestError(`${name} has incorrect value`);
    }
    this._testMin({ name, val: val.length, min });
    this._testMax({ name, val: val.length, max });
    this.dest[name] = val;
  }

  parseInt({ source, name, min, max, required }) {
    let val = this._validateParamsAndGetValue({ source, name, required });
    if (_.isNil(val)) {
      return;
    }

    val = parseInt(val);
    this._testNotIsNaN({ name, val });
    this._testMin({ name, val, min });
    this._testMax({ name, val, max });
    this.dest[name] = val;
  }

  parseFloat({ source, name, min, max, required }) {
    let val = this._validateParamsAndGetValue({ source, name, required });
    if (_.isNil(val)) {
      return;
    }

    val = parseFloat(val);
    this._testNotIsNaN({ name, val });
    this._testMin({ name, val, min });
    this._testMax({ name, val, max });
    this.dest[name] = val;
  }

  parseDate({ source, name, format, min, max, required }) {
    let val = this._validateParamsAndGetValue({ source, name, required });
    if (_.isNil(val)) {
      return;
    }

    format = format || moment.defaultFormat;
    val = moment(val, format);
    this._testIsValidMoment({ name, val });
    this._testMin({ name, val, min: moment.isMoment(min) ? min : moment(min, format) });
    this._testMax({ name, val, max: moment.isMoment(max) ? max : moment(max, format) });
    this.dest[name] = val;
  }

  parseId({ source, name, required }) {
    let val = this._validateParamsAndGetValue({ source, name, required });
    if (_.isNil(val)) {
      return;
    }

    val = parseInt(val);
    if (!validators.isId(val)) {
      this._throwUnprocessableRequestError(`${name} must be a valid ID`);
    }
    this.dest[name] = val;
  }

  // TODO: join with queryBuilder parseIn, parseNin
  parseIdList({ source, name, required }) {
    let val = this._validateParamsAndGetValue({ source, name, required });
    if (_.isNil(val)) {
      return;
    }

    if (!validators.everyIsUniqueId(val)) {
      this._throwUnprocessableRequestError(`${name} must be a valid list of IDs`);
    }
    this.dest[name] = val;
  }

  parseObjectId({ source, name, required }) {
    let val = this._validateParamsAndGetValue({ source, name, required });
    if (_.isNil(val)) {
      return;
    }

    if (!validators.isObjectId(val)) {
      this._throwUnprocessableRequestError(`${name} must be a valid ObjectId`);
    }
    this.dest[name] = val;
  }

  _validateParamsAndGetValue({ source, name, required }) {
    this._testParameterIsProvided({ param: name, paramName: 'name' });
    let val = this._getValue({ source, name });
    this._testIsRequired({ required, name, val });
    return val;
  }

  _getValue({ source, name }) {
    let currentSource = source || this.source;
    return currentSource[name];
  }

  _testParameterIsProvided({ param, paramName }) {
    if (_.isNil(param)) {
      throw new Error(`Incorrect parse parameter, ${paramName} is not provided`);
    }
  }

  _testIsRequired({ name, val, required }) {
    if (required && _.isNil(val)) {
      this._throwUnprocessableRequestError(`${name} is required`);
    }
  }

  _testNotIsNaN({ name, val }) {
    if (_.isNaN(val)) {
      this._throwUnprocessableRequestError(`${name} must be a number`);
    }
  }

  _testIsValidMoment({ name, val }) {
    if (!moment(val).isValid()) {
      this._throwUnprocessableRequestError(`${name} must be a date`);
    }
  }

  _testMin({ name, val, min }) {
    if (!_.isNil(min) && val < min) {
      this._throwUnprocessableRequestError(`${name} must be greater than or equal to ${min}`);
    }
  }

  _testMax({ name, val, max }) {
    if (!_.isNil(max) && val > max) {
      this._throwUnprocessableRequestError(`${name} must be less than or equal to ${max}`);
    }
  }

  _throwUnprocessableRequestError(message) {
    throw new _ErrorType(message);
  }
}

module.exports = ParamsProcessor;
