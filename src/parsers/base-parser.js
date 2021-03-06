const _ = require('lodash')
const ParamsProcessorError = require('../error')

class BaseParser {
  constructor({ val, name, required, def, min, max, allowed } = {}) {
    this.val = val
    this.name = name
    this.required = !!required
    if (!_.isUndefined(def)) {
      this.def = def
    }
    if (!_.isNil(min)) {
      this.min = min
    }
    if (!_.isNil(max)) {
      this.max = max
    }
    if (!_.isNil(allowed)) {
      this.allowed = allowed
    }
  }

  parse() {
    this._validateRequired()

    if (_.isNil(this.val)) {
      this.val = !_.isUndefined(this.def) ? this.def : this.val
      return true
    }
  }

  _validateRequired() {
    if (this.required && _.isNil(this.val)) {
      this._throwIncorrectParamError(`${this.name} is required`)
    }
  }

  _validateAllowed() {
    if (this.allowed && !_.includes(this.allowed, this.val)) {
      this._throwIncorrectParamError(`${this.name} is incorrect, must be one of [${this.allowed}]`)
    }
  }

  _throwIncorrectParamError(message) {
    throw new ParamsProcessorError(message)
  }
}

module.exports = BaseParser
