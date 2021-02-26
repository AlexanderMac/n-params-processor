const _ = require('lodash')
const sinon = require('sinon')
const should = require('should')
const nassert = require('n-assert')
const ParamsProcessorError = require('../../src/error')
const BaseParser = require('../../src/parsers/base-parser')
const JsonParser = require('../../src/parsers/json-parser')

describe('parsers / json-parser', () => {
  function getParams(ex) {
    let def = {
      val: '{ "name": "John" }',
      name: 'user'
    }
    return _.extend(def, ex)
  }

  describe('static getInstance', () => {
    function test() {
      let actual = JsonParser.getInstance({})
      should(actual).be.instanceof(JsonParser)
    }

    it('should create and return instance of JsonParser', () => {
      return test()
    })
  })

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(JsonParser, 'getInstance')
    })

    afterEach(() => {
      JsonParser.getInstance.restore()
    })

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      }
      sinon.spy(mock, 'parse')
      JsonParser.getInstance.returns(mock)

      let actual = JsonParser.parse(params)
      nassert.assert(actual, expected)

      nassert.assertFn({ inst: JsonParser, fnName: 'getInstance', expectedArgs: params })
      nassert.assertFn({ inst: mock, fnName: 'parse', expectedArgs: '_without-args_' })
    }

    it('should create instance of JsonParser, call parse method and return result', () => {
      let params = 'params'
      let expected = 'ok'

      return test({ params, expected })
    })
  })

  describe('parse', () => {
    function test({ params, expected }) {
      let instance = new JsonParser(params)

      BaseParser.prototype.parse.returns(_.isNil(expected))

      if (expected instanceof Error) {
        should(() => instance.parse()).throw(expected)
      } else {
        let actual = instance.parse()
        should(actual).eql(expected)
      }

      should(BaseParser.prototype.parse.calledOnce).equal(true)
    }

    beforeEach(() => {
      sinon.stub(BaseParser.prototype, 'parse')
    })

    afterEach(() => {
      BaseParser.prototype.parse.restore()
    })

    it('should call base.parse only and return undefined when val is undefined', () => {
      test({
        params: getParams({ val: undefined }),
        expected: undefined
      })
    })

    it('should call base.parse only and return null when val is null', () => {
      test({
        params: getParams({ val: null }),
        expected: null
      })
    })

    it('should return true when val is a valid JSON string', () => {
      test({
        params: getParams(),
        expected: { name: 'John' }
      })
    })

    it('should throw Error when val is an invalid JSON string', () => {
      test({
        params: getParams({ val: 'invalid json' }),
        expected: new ParamsProcessorError('user must be a valid JSON string')
      })
    })
  })
})
