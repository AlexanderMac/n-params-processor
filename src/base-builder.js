'use strict';

const _       = require('lodash');
const parsers = require('./parsers');

class ParsersProcessor {
  constructor({ source, data } = {}) {
    this.source = source;
    this.data = data || {};
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

    this[parseFnName] = (params) => {
      let parserParams = _.chain(params)
        .cloneDeep()
        .omit(['source', 'name', 'az'])
        .extend({ val: this._getValue({ source: params.source, name: params.name }) })
        .value();
      let paramVal = parsers[parserName].parse(parserParams);

      let paramName = this._getParamName({ name: params.name, az: params.az, to: params.to });
      return this._processResult({ paramName, paramVal, to: params.to });
    };

    return parseFnName;
  }

  _getParseFunctionName(parserName) {
    return 'parse' + _.replace(parserName, 'Parser', '');
  }

  _getValue({ source, name }) {
    let currentSource = source || this.source;
    return currentSource[name];
  }

  _getParamName({ name, az, to }) {
    let paramName = az || name;
    let dest = _.isNil(to) ? this.data : this.data[to];
    if (_.has(dest, paramName)) {
      throw new Error(`Parameter "${paramName}" is already used. Use another name of remove duplicate`);
    }
    return paramName;
  }

  _processResult({ paramName, paramVal, to }) {
    let dest = _.isNil(to) ? this.data : this.data[to];
    dest[paramName] = paramVal;
    return {
      name: paramName,
      val: paramVal
    };
  }
}

module.exports = ParsersProcessor;
