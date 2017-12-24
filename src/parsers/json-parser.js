'use strict';

const _          = require('lodash');
const BaseParser = require('./base-parser');

class JsonParser extends BaseParser {
  static parse(opts) {
    let instance = new JsonParser(opts);
    return instance.parse();
  }

  parse() {
    super.parse();

    if (_.isNil(this.val)) {
      return this.val;
    }

    this.val = _.attempt(JSON.parse.bind(null, this.val));
    if (_.isError(this.val)) {
      this._throwIncorrectParamError(`${this.name} must be a valid JSON string`);
    }

    return this.val;
  }
}

module.exports = JsonParser;
