'use strict';

const _          = require('lodash');
const moment     = require('moment');
const sinon      = require('sinon');
const should     = require('should');
const testUtil   = require('../test-util');
const BaseParser = require('../../src/parsers/base-parser');
const DateParser = require('../../src/parsers/date-parser');

describe('parsers / date-parser', () => {
  function registerTest(params) {
    params.Parser = DateParser;
    testUtil.registerTest(params);
  }

  function getParams(ex) {
    let def = {
      val: '2017-01-01',
      format: 'YYYY-MM-DD',
      name: 'createdAt'
    };
    return _.extend(def, ex);
  }

  describe('constructor', () => {
    function test({ params, expected }) {
      let instance = new DateParser(params);
      should(instance.val).equal(expected.val);
      should(instance.name).equal(expected.name);
      should(instance.format).equal(expected.format);
      if (expected.min) {
        should(instance.min.isSame(expected.min)).equal(true);
      } else {
        should(instance.min).eql(expected.min);
      }
      if (expected.max) {
        should(instance.max.isSame(expected.max)).equal(true);
      } else {
        should(instance.max).eql(expected.max);
      }
    }

    function getParams(ex) {
      let def = {
        val: '15',
        name: 'createdAt',
        format: 'YYYY-MM-DD',
        min: '2016-01-01',
        max: '2017-01-01'
      };
      return _.extend(def, ex);
    }

    function getExpectedParams(params, ex) {
      return _.chain(params)
        .clone()
        .extend(ex)
        .value();
    }

    it('should create an instance and set format, min, max when format is provided', () => {
      let params = getParams();
      let expected = getExpectedParams(params, {
        min: moment('2016-01-01'),
        max: moment('2017-01-01')
      });

      test({ params, expected });
    });

    it('should create an instance and set format, min, max when format is not provided', () => {
      let params = getParams({
        format: undefined
      });
      let expected = getExpectedParams(params, {
        format: 'YYYY-MM-DDTHH:mm:ssZ',
        min: moment('2016-01-01'),
        max: moment('2017-01-01')
      });

      test({ params, expected });
    });

    it('should create an instance and set format, min, max when min is not provided', () => {
      let params = getParams({
        min: undefined
      });
      let expected = getExpectedParams(params, {
        min: undefined,
        max: moment('2017-01-01')
      });

      test({ params, expected });
    });

    it('should create an instance and set format, min, max when min is a moment object', () => {
      let params = getParams({
        min: moment('2016-01-01')
      });
      let expected = getExpectedParams(params, {
        min: moment('2016-01-01'),
        max: moment('2017-01-01')
      });

      test({ params, expected });
    });

    it('should create an instance and set format, min, max when max is not provided', () => {
      let params = getParams({
        max: undefined
      });
      let expected = getExpectedParams(params, {
        min: moment('2016-01-01'),
        max: undefined
      });

      test({ params, expected });
    });

    it('should create an instance and set format, min, max when max is a moment object', () => {
      let params = getParams({
        max: moment('2017-01-01')
      });
      let expected = getExpectedParams(params, {
        min: moment('2016-01-01'),
        max: moment('2017-01-01')
      });

      test({ params, expected });
    });
  });

  describe('parse', () => {
    function test({ params, expected, areTestMethodsCalled }) {
      let instance = new DateParser(params);
      sinon.stub(instance, '_validateMomentDate');
      sinon.stub(instance, '_validateMin');
      sinon.stub(instance, '_validateMax');

      BaseParser.prototype.parse.returns(_.isNil(expected));

      let actual = instance.parse();
      should(actual).eql(expected);

      should(BaseParser.prototype.parse.calledOnce).equal(true);
      should(instance._validateMomentDate.calledOnce).equal(areTestMethodsCalled);
      should(instance._validateMin.calledOnce).equal(areTestMethodsCalled);
      should(instance._validateMax.calledOnce).equal(areTestMethodsCalled);
    }

    beforeEach(() => {
      sinon.stub(BaseParser.prototype, 'parse');
    });

    afterEach(() => {
      BaseParser.prototype.parse.restore();
    });

    it('should call base.parse only and return undefined when val is undefined', () => {
      test({
        params: getParams({ val: undefined }),
        expected: undefined,
        areTestMethodsCalled: false
      });
    });

    it('should call base.parse only and return null when val is null', () => {
      test({
        params: getParams({ val: null }),
        expected: null,
        areTestMethodsCalled: false
      });
    });

    it('should call all related methods and return a date', () => {
      test({
        params: getParams(),
        expected: moment('2017-01-01', 'YYYY-MM-DD'),
        areTestMethodsCalled: true
      });
    });
  });

  describe('_validateMomentDate', () => {
    registerTest({
      methodName: '_validateMomentDate',
      testName: 'should throw error when val is not a valid date',
      params: getParams({ val: moment('Invalid date', moment.defaultFormat) }),
      expected: new Error('createdAt must be a valid date')
    });

    registerTest({
      methodName: '_validateMomentDate',
      testName: 'should not throw error when val is a valid date',
      params: getParams({ val: moment() })
    });
  });

  describe('_validateMin', () => {
    registerTest({
      methodName: '_validateMin',
      testName: 'should throw error when op.min is defined and provided val is less than min',
      params: getParams({ min: '2018-01-01', val: moment('2017-01-01', 'YYYY-MM-DD') }),
      expected: new Error('createdAt must be greater than or equal to 2018-01-01')
    });

    registerTest({
      methodName: '_validateMin',
      testName: 'should not throw error when op.min is defined and val is greater than min',
      params: getParams({ min: '2016-01-01', val: moment('2017-01-01', 'YYYY-MM-DD') })
    });

    registerTest({
      methodName: '_validateMin',
      testName: 'should not throw error when op.min is not defined',
      params: getParams()
    });
  });

  describe('_validateMax', () => {
    registerTest({
      methodName: '_validateMax',
      testName: 'should throw error when op.max is defined and provided val is greater than max',
      params: getParams({ max: '2016-01-01', val: moment('2017-01-01', 'YYYY-MM-DD') }),
      expected: new Error('createdAt must be less than or equal to 2016-01-01')
    });

    registerTest({
      methodName: '_validateMax',
      testName: 'should not throw error when op.max is defined and val is less than max',
      params: getParams({ max: '2018-01-01', val: moment('2017-01-01', 'YYYY-MM-DD') })
    });

    registerTest({
      methodName: '_validateMax',
      testName: 'should not throw error when op.max is not defined',
      params: getParams()
    });
  });
});
