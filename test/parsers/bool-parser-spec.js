const _ = require('lodash')
const sinon = require('sinon')
const should = require('should')
const nassert = require('n-assert')
const ParamsProcessorError = require('../../src/error')
const BaseParser = require('../../src/parsers/base-parser')
const BoolParser = require('../../src/parsers/bool-parser')

describe('parsers / bool-parser', () => {
  function getParams(ex) {
    let def = {
      val: 'true',
      name: 'success'
    }
    return _.extend(def, ex)
  }

  describe('static getInstance', () => {
    function test() {
      let actual = BoolParser.getInstance({})
      should(actual).be.instanceof(BoolParser)
    }

    it('should create and return instance of BoolParser', () => {
      return test()
    })
  })

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(BoolParser, 'getInstance')
    })

    afterEach(() => {
      BoolParser.getInstance.restore()
    })

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      }
      sinon.spy(mock, 'parse')
      BoolParser.getInstance.returns(mock)

      let actual = BoolParser.parse(params)
      nassert.assert(actual, expected)

      nassert.assertFn({ inst: BoolParser, fnName: 'getInstance', expectedArgs: params })
      nassert.assertFn({ inst: mock, fnName: 'parse', expectedArgs: '_without-args_' })
    }

    it('should create instance of BoolParser, call parse method and return result', () => {
      let params = 'params'
      let expected = 'ok'

      return test({ params, expected })
    })
  })

  describe('parse', () => {
    function test({ params, expected }) {
      let instance = new BoolParser(params)

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

    it('should return true when val is true', () => {
      test({
        params: getParams({ val: true }),
        expected: true
      })
    })

    it('should return false when val is false', () => {
      test({
        params: getParams({ val: false }),
        expected: false
      })
    })

    it('should return true when val is `true` string', () => {
      test({
        params: getParams({ val: 'true' }),
        expected: true
      })
    })

    it('should return false when val is `false` string', () => {
      test({
        params: getParams({ val: 'false' }),
        expected: false
      })
    })

    it('should throw Error when val is a string, but not true, false', () => {
      test({
        params: getParams({ val: 'invalid boolean' }),
        expected: new ParamsProcessorError('success must be a valid boolean value')
      })
    })

    it('should throw Error when val is not boolean and string', () => {
      test({
        params: getParams({ val: 155 }),
        expected: new ParamsProcessorError('success must be a valid boolean value')
      })
    })
  })
})
