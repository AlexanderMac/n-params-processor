'use strict';

const _          = require('lodash');
const BaseParser = require('./base-parser');

class ArrayParser extends BaseParser {
  static parse(params) {
    let instance = new ArrayParser(params);
    return instance.parse();
  }

  constructor(params) {
    super(params);
    this.ItemParser = params.ItemParser;
  }

  parse() {
    super.parse();

    if (_.isNil(this.val)) {
      return this.val;
    }

    this._validateItemParser();
    this.val = _.map(this.val, item => this._parseItem(item));

    return this.val;
  }

  _validateItemParser() {
    if (_.isNil(this.ItemParser)) {
      this._throwIncorrectParamError('Invalid itemType');
    }
  }

  _parseItem(item) {
    return this.ItemParser.parse({
      val: item,
      name: 'item',
      required: true
    });
  }
}

module.exports = ArrayParser;
