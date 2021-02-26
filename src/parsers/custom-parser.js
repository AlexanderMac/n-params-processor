const _ = require('lodash')
const BaseParser = require('./base-parser')

class CustomParser extends BaseParser {
  static getInstance(params) {
    return new CustomParser(params)
  }

  static parse(params) {
    return CustomParser.getInstance(params).parse()
  }

  constructor(params) {
    super(params)
    this.handler = params.handler
  }

  parse() {
    let isNilOrDefault = super.parse()
    if (isNilOrDefault) {
      return this.val
    }
    if (!_.isFunction(this.handler)) {
      this._throwIncorrectParamError('handler must be a function')
    }
    this.val = this.handler(this.val)
    return this.val
  }
}

module.exports = CustomParser
