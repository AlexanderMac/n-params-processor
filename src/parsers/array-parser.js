const _ = require('lodash');
const BaseParser = require('./base-parser');
const parsers = require('./');

class ArrayParser extends BaseParser {
  static getInstance(params) {
    return new ArrayParser(params);
  }

  static parse(params) {
    return ArrayParser.getInstance(params).parse();
  }

  constructor(params) {
    super(params);
    this.itemType = params.itemType;
    this.itemHandler = params.itemHandler;
    this.ItemParser = parsers[`${_.upperFirst(this.itemType)}Parser`];
  }

  parse() {
    let isNilOrDefault = super.parse();
    if (isNilOrDefault) {
      return this.val;
    }

    this._validateItemParser();
    this.val = _.map(this.val, item => this._parseItem(item));
    this._validateAllowed();

    return this.val;
  }

  _validateItemParser() {
    if (_.isNil(this.ItemParser)) {
      this._throwIncorrectParamError('Invalid itemType');
    }
  }

  _validateAllowed() {
    if (this.allowed && _.difference(this.val, this.allowed).length > 0) {
      this._throwIncorrectParamError(`${this.name} is incorrect, must be subset of [${this.allowed}]`);
    }
  }

  _parseItem(item) {
    return this.ItemParser.parse({
      val: item,
      name: 'item',
      handler: this.itemHandler,
      required: true
    });
  }
}

module.exports = ArrayParser;
