const _ = require('lodash')
const sinon = require('sinon')
const should = require('should')
const nassert = require('n-assert')
const testUtil = require('../../test-util')
const ParamsProcessorError = require('../../../src/error')
const BaseParser = require('../../../src/parsers/base-parser')
const NumberParser = require('../../../src/parsers/number-parsers/number-parser')

describe('parsers / number-parsers / number-parser', () => {
  function registerTest(params) {
    params.Parser = NumberParser
    testUtil.registerTest(params)
  }

  function getParams(ex) {
    let def = {
      val: 18,
      name: 'age'
    }
    return _.extend(def, ex)
  }

  describe('static getInstance', () => {
    function test() {
      let actual = NumberParser.getInstance({})
      should(actual).be.instanceof(NumberParser)
    }

    it('should create and return instance of NumberParser', () => {
      return test()
    })
  })

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(NumberParser, 'getInstance')
    })

    afterEach(() => {
      NumberParser.getInstance.restore()
    })

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      }
      sinon.spy(mock, 'parse')
      NumberParser.getInstance.returns(mock)

      let actual = NumberParser.parse(params)
      nassert.assert(actual, expected)

      nassert.assertFn({ inst: NumberParser, fnName: 'getInstance', expectedArgs: params })
      nassert.assertFn({ inst: mock, fnName: 'parse', expectedArgs: '_without-args_' })
    }

    it('should create instance of NumberParser, call parse method and return result', () => {
      let params = 'params'
      let expected = 'ok'

      return test({ params, expected })
    })
  })

  describe('parse', () => {
    function test({ params, expected, areTestMethodsCalled }) {
      let instance = new NumberParser(params)
      sinon.stub(instance, '_convert')
      sinon.stub(instance, '_validateNumber')
      sinon.stub(instance, '_validateAllowed')
      sinon.stub(instance, '_validateMin')
      sinon.stub(instance, '_validateMax')

      BaseParser.prototype.parse.returns(_.isNil(expected))

      let actual = instance.parse()
      should(actual).eql(expected)

      should(BaseParser.prototype.parse.calledOnce).equal(true)
      should(instance._convert.calledOnce).equal(areTestMethodsCalled)
      should(instance._validateNumber.calledOnce).equal(areTestMethodsCalled)
      should(instance._validateAllowed.calledOnce).equal(areTestMethodsCalled)
      should(instance._validateMin.calledOnce).equal(areTestMethodsCalled)
      should(instance._validateMax.calledOnce).equal(areTestMethodsCalled)
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

    it('should call all related methods and return zero when val is zero', () => {
      test({
        params: getParams({ val: 0 }),
        expected: 0,
        areTestMethodsCalled: true
      })
    })

    it('should call all related methods and return a result', () => {
      test({
        params: getParams(),
        expected: 18,
        areTestMethodsCalled: true
      })
    })
  })

  describe('_convert', () => {
    registerTest({
      methodName: '_convert',
      testName: 'should set instance.val to NaN when val ca not be converted to a number',
      params: getParams({ val: 'Wrong number' }),
      expected: NaN
    })

    registerTest({
      methodName: '_convert',
      testName: 'should set instance.val to a number when val is a number string',
      params: getParams({ val: '18' }),
      expected: 18
    })

    registerTest({
      methodName: '_convert',
      testName: 'should set instance.val to a number when val is a number',
      params: getParams({ val: 18 }),
      expected: 18
    })
  })

  describe('_validateNumber', () => {
    registerTest({
      methodName: '_validateNumber',
      testName: 'shouldn throw error when val is NaN',
      expected: new ParamsProcessorError('age must be a number'),
      params: getParams({ val: NaN })
    })

    registerTest({
      methodName: '_validateNumber',
      testName: 'should not throw error when val is a number',
      params: getParams()
    })
  })

  describe('_validateMin', () => {
    registerTest({
      methodName: '_validateMin',
      testName: 'should throw error when op.min is defined and provided val is less than min',
      params: getParams({ min: 19 }),
      expected: new ParamsProcessorError('age must be greater than or equal to 19')
    })

    registerTest({
      methodName: '_validateMin',
      testName: 'should not throw error when op.min is defined and val is greater than min',
      params: getParams({ min: 17 })
    })

    registerTest({
      methodName: '_validateMin',
      testName: 'should not throw error when op.min is not defined',
      params: getParams()
    })
  })

  describe('_validateMax', () => {
    registerTest({
      methodName: '_validateMax',
      testName: 'should throw error when op.min is defined and provided val is greater than max',
      params: getParams({ max: 17 }),
      expected: new ParamsProcessorError('age must be less than or equal to 17')
    })

    registerTest({
      methodName: '_validateMax',
      testName: 'should not throw error when op.max is defined and val is less than max',
      params: getParams({ max: 19 })
    })

    registerTest({
      methodName: '_validateMax',
      testName: 'should not throw error when op.max is not defined',
      params: getParams()
    })
  })
})
