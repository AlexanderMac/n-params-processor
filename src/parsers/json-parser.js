const _ = require('lodash')
const BaseParser = require('./base-parser')

class JsonParser extends BaseParser {
  static getInstance(params) {
    return new JsonParser(params)
  }

  static parse(params) {
    return JsonParser.getInstance(params).parse()
  }

  parse() {
    let isNilOrDefault = super.parse()
    if (isNilOrDefault) {
      return this.val
    }

    this.val = _.attempt(JSON.parse.bind(null, this.val))
    if (_.isError(this.val)) {
      this._throwIncorrectParamError(`${this.name} must be a valid JSON string`)
    }

    return this.val
  }
}

module.exports = JsonParser
