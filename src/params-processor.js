'use strict';

const _       = require('lodash');
const parsers = require('./parsers');

let _ErrorType = Error;

class ParamsProcessor {
  static registerErrorType(ErrorType) {
    _ErrorType = ErrorType;
    parsers.BaseParser.registerErrorType(ErrorType);
  }

  constructor({ source, dest } = {}) {
    this.source = source;
    this.dest = dest;
  }

  parseString({ source, name, outName, min, max, allowed, required }) {
    let val = this._getValue({ source, name });
    this.dest[outName || name] = parsers.StringParser.parse({ val, name, min, max, allowed, required });
  }

  parseInt({ source, name, outName, min, max, allowed, required }) {
    let val = this._getValue({ source, name });
    this.dest[outName || name] = parsers.IntParser.parse({ val, name, min, max, allowed, required });
  }

  parseFloat({ source, name, outName, min, max, allowed, required }) {
    let val = this._getValue({ source, name });
    this.dest[outName || name] = parsers.FloatParser.parse({ val, name, min, max, allowed, required });
  }

  parseId({ source, name, outName, min, max, allowed, required }) {
    let val = this._getValue({ source, name });
    this.dest[outName || name] = parsers.IdParser.parse({ val, name, min, max, allowed, required });
  }

  parseDate({ source, name, outName, format, min, max, required }) {
    let val = this._getValue({ source, name });
    this.dest[outName || name] = parsers.DateParser.parse({ val, name, format, min, max, required });
  }

  parseObjectId({ source, name, outName, required }) {
    let val = this._getValue({ source, name });
    this.dest[outName || name] = parsers.ObjectIdParser.parse({ val, name, required });
  }

  parseJson({ source, name, outName, required }) {
    let val = this._getValue({ source, name });
    this.dest[outName || name] = parsers.JsonParser.parse({ val, name, required });
  }

  parseBool({ source, name, outName, required }) {
    let val = this._getValue({ source, name });
    this.dest[outName || name] = parsers.BoolParser.parse({ val, name, required });
  }

  parseArray({ source, name, outName, required, items, itemType }) {
    let val = this._getValue({ source, name });
    let ItemParser = parsers[`${itemType}Parser`];
    this.dest[outName || name] = parsers.ArrayParser.parse({ val, name, required, items, ItemParser });
  }

  _getValue({ source, name }) {
    let currentSource = source || this.source;
    return currentSource[name];
  }

  // TODO: obsolete
  _validateParamsAndGetValue({ source, name, required }) {
    let val = this._getValue({ source, name });
    this._validateRequired({ required, name, val });
    return val;
  }

  // TODO: obsolete
  _validateParameterProvided({ param, paramName }) {
    if (_.isNil(param)) {
      throw new Error(`Incorrect parse parameter, ${paramName} is not provided`);
    }
  }

  // TODO: obsolete
  _validateRequired({ name, val, required }) {
    if (required && _.isNil(val)) {
      this._throwUnprocessableRequestError(`${name} is required`);
    }
  }

  // TODO: obsolete
  _throwUnprocessableRequestError(message) {
    throw new _ErrorType(message);
  }
}

module.exports = ParamsProcessor;
