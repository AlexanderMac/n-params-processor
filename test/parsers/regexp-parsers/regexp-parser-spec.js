const _ = require('lodash')
const sinon = require('sinon')
const should = require('should')
const nassert = require('n-assert')
const testUtil = require('../../test-util')
const ParamsProcessorError = require('../../../src/error')
const BaseParser = require('../../../src/parsers/base-parser')
const RegexpParser = require('../../../src/parsers/regexp-parsers/regexp-parser')

describe('parsers / regexp-parsers / regexp-parser', () => {
  function registerTest(params) {
    params.Parser = RegexpParser
    testUtil.registerTest(params)
  }

  function getParams(ex) {
    let def = {
      val: 'John',
      name: 'name',
      pattern: /[a-zA-Z]/
    }
    return _.extend(def, ex)
  }

  describe('static getInstance', () => {
    function test() {
      let actual = RegexpParser.getInstance({})
      should(actual).be.instanceof(RegexpParser)
    }

    it('should create and return instance of RegexpParser', () => {
      return test()
    })
  })

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(RegexpParser, 'getInstance')
    })

    afterEach(() => {
      RegexpParser.getInstance.restore()
    })

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      }
      sinon.spy(mock, 'parse')
      RegexpParser.getInstance.returns(mock)

      let actual = RegexpParser.parse(params)
      nassert.assert(actual, expected)

      nassert.assertFn({ inst: RegexpParser, fnName: 'getInstance', expectedArgs: params })
      nassert.assertFn({ inst: mock, fnName: 'parse', expectedArgs: '_without-args_' })
    }

    it('should create instance of RegexpParser, call parse method and return result', () => {
      let params = 'params'
      let expected = 'ok'

      return test({ params, expected })
    })
  })

  describe('parse', () => {
    function test({ params, expected, areTestMethodsCalled }) {
      let instance = new RegexpParser(params)
      sinon.stub(instance, '_validate')

      BaseParser.prototype.parse.returns(_.isNil(expected))

      let actual = instance.parse()
      should(actual).eql(expected)

      should(BaseParser.prototype.parse.calledOnce).equal(true)
      should(instance._validate.calledOnce).equal(areTestMethodsCalled)
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
        expected: undefined,
        areTestMethodsCalled: false
      })
    })

    it('should call base.parse only and return null when val is null', () => {
      test({
        params: getParams({ val: null }),
        expected: null,
        areTestMethodsCalled: false
      })
    })

    it('should call all related methods and return a result', () => {
      test({
        params: getParams(),
        expected: 'John',
        areTestMethodsCalled: true
      })
    })
  })

  describe('_validate', () => {
    registerTest({
      methodName: '_validate',
      testName: 'should throw error when val is not a string',
      params: getParams({ val: 19 }),
      expected: new ParamsProcessorError('There is no match between regexp and name')
    })

    registerTest({
      methodName: '_validate',
      testName: 'should throw error when there is no match between regexp and name',
      params: getParams({ val: '19' }),
      expected: new ParamsProcessorError('There is no match between regexp and name')
    })

    registerTest({
      methodName: '_validate',
      testName: 'should not throw error when val is a string and there is a match between regexp and name',
      params: getParams()
    })
  })
})
