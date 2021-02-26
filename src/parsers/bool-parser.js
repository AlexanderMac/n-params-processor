const _ = require('lodash')
const BaseParser = require('./base-parser')

class BoolParser extends BaseParser {
  static getInstance(params) {
    return new BoolParser(params)
  }

  static parse(params) {
    return BoolParser.getInstance(params).parse()
  }

  parse() {
    let isNilOrDefault = super.parse()
    if (isNilOrDefault) {
      return this.val
    }

    if (_.isBoolean(this.val)) {
      return this.val
    }
    if (_.isString(this.val)) {
      this.val = _.toLower(this.val)
      if (this.val === 'true') {
        this.val = true
        return this.val
      }
      if (this.val === 'false') {
        this.val = false
        return this.val
      }
    }

    this._throwIncorrectParamError(`${this.name} must be a valid boolean value`)
  }
}

module.exports = BoolParser
