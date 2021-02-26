const _ = require('lodash')
const moment = require('moment')
const sinon = require('sinon')
const should = require('should')
const nassert = require('n-assert')
const testUtil = require('../test-util')
const ParamsProcessorError = require('../../src/error')
const BaseParser = require('../../src/parsers/base-parser')
const DateParser = require('../../src/parsers/date-parser')

describe('parsers / date-parser', () => {
  function registerTest(params) {
    params.Parser = DateParser
    testUtil.registerTest(params)
  }

  function getParams(ex) {
    let def = {
      val: '2017-01-01',
      format: 'YYYY-MM-DD',
      name: 'createdAt'
    }
    return _.extend(def, ex)
  }

  describe('static getInstance', () => {
    function test() {
      let actual = DateParser.getInstance({})
      should(actual).be.instanceof(DateParser)
    }

    it('should create and return instance of DateParser', () => {
      return test()
    })
  })

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(DateParser, 'getInstance')
    })

    afterEach(() => {
      DateParser.getInstance.restore()
    })

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      }
      sinon.spy(mock, 'parse')
      DateParser.getInstance.returns(mock)

      let actual = DateParser.parse(params)
      nassert.assert(actual, expected)

      nassert.assertFn({ inst: DateParser, fnName: 'getInstance', expectedArgs: params })
      nassert.assertFn({ inst: mock, fnName: 'parse', expectedArgs: '_without-args_' })
    }

    it('should create instance of DateParser, call parse method and return result', () => {
      let params = 'params'
      let expected = 'ok'

      return test({ params, expected })
    })
  })

  describe('constructor', () => {
    function test({ params, expected }) {
      let instance = new DateParser(params)
      should(instance.val).equal(expected.val)
      should(instance.name).equal(expected.name)
      should(instance.format).equal(expected.format)
      should(instance.formatRes).equal(expected.formatRes)
      if (expected.min) {
        should(instance.min.isSame(expected.min)).equal(true)
      } else {
        should(instance.min).equal(undefined)
      }
      if (expected.max) {
        should(instance.max.isSame(expected.max)).equal(true)
      } else {
        should(instance.max).equal(undefined)
      }
    }

    it('should use params.format when it is provided', () => {
      let params = {
        format: 'YYYY-MM-DD'
      }
      let expected = {
        format: 'YYYY-MM-DD'
      }

      test({ params, expected })
    })

    it('should use default format when params.format is not provided', () => {
      let params = {}
      let expected = {
        format: 'YYYY-MM-DDTHH:mm:ssZ'
      }

      test({ params, expected })
    })

    it('should use params.formatRes when it is provided', () => {
      let params = {
        formatRes: 'YYYY-MM-DD'
      }
      let expected = {
        format: 'YYYY-MM-DDTHH:mm:ssZ',
        formatRes: 'YYYY-MM-DD'
      }

      test({ params, expected })
    })

    it('should use params.min, params.max when they are provided and in string format', () => {
      let params = {
        min: '2016-01-01',
        max: '2017-01-01'
      }
      let expected = {
        format: 'YYYY-MM-DDTHH:mm:ssZ',
        min: moment('2016-01-01'),
        max: moment('2017-01-01')
      }

      test({ params, expected })
    })

    it('should use params.min, params.max when they are provided and in moment format', () => {
      let params = {
        min: moment('2016-01-01'),
        max: moment('2017-01-01')
      }
      let expected = {
        format: 'YYYY-MM-DDTHH:mm:ssZ',
        min: moment('2016-01-01'),
        max: moment('2017-01-01')
      }

      test({ params, expected })
    })
  })

  describe('parse', () => {
    function test({ params, expected, areTestMethodsCalled }) {
      let instance = new DateParser(params)
      sinon.stub(instance, '_validateMomentDate')
      sinon.stub(instance, '_validateMin')
      sinon.stub(instance, '_validateMax')
      sinon.stub(instance, '_getResult').returns(expected)

      BaseParser.prototype.parse.returns(_.isNil(expected))

      let actual = instance.parse()
      should(actual).eql(expected)

      should(BaseParser.prototype.parse.calledOnce).equal(true)
      should(instance._validateMomentDate.calledOnce).equal(areTestMethodsCalled)
      should(instance._validateMin.calledOnce).equal(areTestMethodsCalled)
      should(instance._validateMax.calledOnce).equal(areTestMethodsCalled)
      should(instance._getResult.calledOnce).equal(areTestMethodsCalled)
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

    it('should call all related methods and return a date', () => {
      test({
        params: getParams(),
        expected: moment('2017-01-01', 'YYYY-MM-DD'),
        areTestMethodsCalled: true
      })
    })
  })

  describe('_validateMomentDate', () => {
    registerTest({
      methodName: '_validateMomentDate',
      testName: 'should throw error when val is not a valid date',
      params: getParams({ val: moment('Invalid date', moment.defaultFormat) }),
      expected: new ParamsProcessorError('createdAt must be a valid date')
    })

    registerTest({
      methodName: '_validateMomentDate',
      testName: 'should not throw error when val is a valid date',
      params: getParams({ val: moment() })
    })
  })

  describe('_validateMin', () => {
    registerTest({
      methodName: '_validateMin',
      testName: 'should throw error when op.min is defined and provided val is less than min',
      params: getParams({ min: '2018-01-01', val: moment('2017-01-01', 'YYYY-MM-DD') }),
      expected: new ParamsProcessorError('createdAt must be greater than or equal to 2018-01-01')
    })

    registerTest({
      methodName: '_validateMin',
      testName: 'should not throw error when op.min is defined and val is greater than min',
      params: getParams({ min: '2016-01-01', val: moment('2017-01-01', 'YYYY-MM-DD') })
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
      testName: 'should throw error when op.max is defined and provided val is greater than max',
      params: getParams({ max: '2016-01-01', val: moment('2017-01-01', 'YYYY-MM-DD') }),
      expected: new ParamsProcessorError('createdAt must be less than or equal to 2016-01-01')
    })

    registerTest({
      methodName: '_validateMax',
      testName: 'should not throw error when op.max is defined and val is less than max',
      params: getParams({ max: '2018-01-01', val: moment('2017-01-01', 'YYYY-MM-DD') })
    })

    registerTest({
      methodName: '_validateMax',
      testName: 'should not throw error when op.max is not defined',
      params: getParams()
    })
  })

  describe('_getResult', () => {
    registerTest({
      methodName: '_getResult',
      testName: 'should return val when formatRes is undefined',
      params: getParams({ formatRes: undefined, val: moment('2017-01-01', 'YYYY-MM-DD') }),
      expectedRes: moment('2017-01-01', 'YYYY-MM-DD')
    })

    registerTest({
      methodName: '_getResult',
      testName: 'should return val when formatRes is provided and val is undefined',
      params: getParams({ formatRes: Date, val: undefined }),
      expectedRes: undefined
    })

    registerTest({
      methodName: '_getResult',
      testName: 'should return val converted to Date when formatRes is Date and val is not undefined',
      params: getParams({ formatRes: Date, val: moment('2017-01-01', 'YYYY-MM-DD') }),
      expectedRes: moment('2017-01-01', 'YYYY-MM-DD').toDate()
    })

    registerTest({
      methodName: '_getResult',
      testName: 'should return val converted to format string when formatRes is format string and val is not undefined',
      params: getParams({ formatRes: 'YYYY-MM-DD', val: moment('2017-01-01', 'YYYY-MM-DD') }),
      expectedRes: moment('2017-01-01', 'YYYY-MM-DD').format('YYYY-MM-DD')
    })
  })
})
