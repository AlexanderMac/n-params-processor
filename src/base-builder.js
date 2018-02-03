'use strict';

const _       = require('lodash');
const parsers = require('./parsers');

class ParsersProcessor {
  constructor(source) {
    this.source = source;
    this.data = {};
    this._registerParseFunctions();
  }

  _registerParseFunctions() {
    _.chain(parsers)
      .keys()
      .each(parserName => this._registerOneParseFunction(parserName))
      .value();
  }

  _registerOneParseFunction(parserName) {
    let parseFnName = this._getParseFunctionName(parserName);

    this[parseFnName] = ({ source, name, az, ...params }) => {
      params = _.chain(params)
        .cloneDeep()
        .extend({ val: this._getValue({ source, name }) })
        .value();
      let parsedVal = parsers[parserName].parse(params);

      return this._processResult({ name, az: az, parsedVal });
    };
  }

  _getParseFunctionName(parserName) {
    return 'parse' + _.replace(parserName, 'Parser', '');
  }

  _getValue({ source, name }) {
    let currentSource = source || this.source;
    return currentSource[name];
  }

  _processResult({ name, az, parsedVal }) {
    this.data[az || name] = parsedVal;
    return {
      name: az || name,
      val: parsedVal
    };
  }
}

module.exports = ParsersProcessor;
