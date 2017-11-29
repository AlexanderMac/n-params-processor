'use strict';

const _          = require('lodash');
const moment     = require('moment');
const sinon      = require('sinon');
const should     = require('should');
const ParamsProc = require('../src/params-processor');

describe('params-processor', () => {
  let _instance;

  function registerParseParamTest({ parseFnName, testName, params, expected }) {
    it(testName, () => {
      _instance.dest = { baseVal: 'baseValue' };
      if (expected instanceof Error) {
        should(() => _instance[parseFnName](params)).throw(expected);
      } else {
        _instance[parseFnName](params);
        _.extend(expected, { baseVal: 'baseValue' });
        should(_instance.dest).eql(expected);
      }
    });
  }

  function registerCommonParseParamTests(parseFnName) {
    function getParams(overrides) {
      let def = {
        source: { login: 'u1' },
        name: 'login'
      };
      return _.extend(def, overrides);
    }

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when name is not provided',
      params: getParams({ name: undefined }),
      expected: new Error('Incorrect parse parameter, name is not provided')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when required is true and val is undefined',
      params: getParams({ source: { login: undefined }, required: true }),
      expected: new Error('login is required')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should don\'t chane instance.dest when required is false and val is undefined',
      params: getParams({ source: { login: undefined }, required: false }),
      expected: {}
    });
  }

  beforeEach(() => {
    _instance = new ParamsProc();
  });

  describe('parseString', () => {
    let parseFnName = 'parseString';

    function getParams(overrides) {
      let def = {
        source: { login: 'u1' },
        name: 'login'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when allowed is defined and val is not in it',
      params: getParams({ allowed: ['u2', 'u3'] }),
      expected: new Error('login has incorrect value')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should set parsed value to instance.dest when pameter is valid and val is an empty string',
      params: getParams({ source: { login: '' }}),
      expected: { login: '' }
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should set parsed value to instance.dest when parameter is valid and val is a number',
      params: getParams({ source: { age: '25' }, name: 'age' }),
      expected: { age: '25' }
    });
  });

  describe('parseInt', () => {
    let parseFnName = 'parseInt';

    function getParams(overrides) {
      let def = {
        source: { age: '25' },
        name: 'age'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val can\'t be convered to integer',
      params: getParams({ source: { age: 'not an IntegerNumber' }}),
      expected: new Error('age must be a number')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when op.min is defined and provided val is less than min',
      params: getParams({ min: 30 }),
      expected: new Error('age must be greater than or equal to 30')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when max is defined and provided val is greater than max',
      params: getParams({ max: 20 }),
      expected: new Error('age must be less than or equal to 20')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should set parsed value to instance.dest when parameter is valid and val is zero',
      params: getParams({ source: { age: 0 }}),
      expected: { age: 0 }
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should set parsed value to instance.dest when parameter is valid and val is zero',
      params: getParams(),
      expected: { age: 25 }
    });
  });

  describe('parseFloat', () => {
    let parseFnName = 'parseFloat';

    function getParams(overrides) {
      let def = {
        source: { age: '25.5' },
        name: 'age'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val can\'t be convered to float',
      params: getParams({ source: { age: 'not a FloatNumber' }}),
      expected: new Error('age must be a number')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when min is defined and provided val is less than min',
      params: getParams({ min: 30 }),
      expected: new Error('age must be greater than or equal to 30')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when max is defined and provided val is greater than max',
      params: getParams({ max: 20 }),
      expected: new Error('age must be less than or equal to 20')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should set parsed value to instance.dest when parameter is valid and val is zero',
      params: getParams(),
      expected: { age: 25.5 }
    });
  });

  describe('parseDate', () => {
    let parseFnName = 'parseDate';

    function getParams(overrides) {
      let def = {
        source: { birthDate: '1998-11-07' },
        name: 'birthDate'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val can\'t be convered to date',
      params: getParams({ source: { birthDate: 'not a Date' }}),
      expected: new Error('birthDate must be a date')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should set parsed value to instance.dest when parameter is valid and val is zero',
      params: getParams(),
      expected: { birthDate: moment('1998-11-07', moment.defaultFormat) }
    });
  });

  describe('parseId', () => {
    let parseFnName = 'parseId';

    function getParams(overrides) {
      let def = {
        source: { id: 11 },
        name: 'id'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val is not a correct RDBMS id',
      params: getParams({ source: { id: 'not valid id' }}),
      expected: new Error('id must be a valid ID')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should set parsed value to instance.dest when parameter is valid and val is zero',
      params: getParams(),
      expected: { id: 11 }
    });
  });

  describe('parseIdList', () => {
    let parseFnName = 'parseIdList';

    function getParams(overrides) {
      let def = {
        source: { ids: [11, 12] },
        name: 'ids'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val contains incorrect RDBMS id',
      params: getParams({ source: { ids: [11, 'not valid id', 13] }}),
      expected: new Error('ids must be a valid list of IDs')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should set parsed value to instance.dest when parameter is valid and val is zero',
      params: getParams(),
      expected: { ids: [11, 12] }
    });
  });

  describe('parseObjectId', () => {
    let parseFnName = 'parseObjectId';

    function getParams(overrides) {
      let def = {
        source: { _id: '583c9a0906c20c1c91103fb4' },
        name: '_id'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val is not a correct MongoDB ObjectId',
      params: getParams({ source: { _id: 'not valid ObjectId' }}),
      expected: new Error('_id must be a valid ObjectId')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should set parsed value to instance.dest when parameter is valid',
      params: getParams(),
      expected: { _id: '583c9a0906c20c1c91103fb4' }
    });
  });

  describe('_validateParamsAndGetValue', () => {
    function test({ source, name, val, required, expected }) {
      let actual = _instance._validateParamsAndGetValue({ source, name, required });
      should(actual).eql(expected);

      should(_instance._testParameterIsProvided.calledOnce).equal(true);
      should(_instance._getValue.calledOnce).equal(true);
      should(_instance._testIsRequired.calledOnce).equal(true);
      should(_instance._testParameterIsProvided.calledWith(sinon.match({ param: name }))).equal(true);
      should(_instance._getValue.calledWith(sinon.match({ source, name }))).equal(true);
      should(_instance._testIsRequired.calledWith(sinon.match({ required, name, val }))).equal(true);
    }

    beforeEach(() => {
      sinon.stub(_instance, '_testParameterIsProvided');
      sinon.stub(_instance, '_getValue').callsFake(() => 'value');
      sinon.stub(_instance, '_testIsRequired');
    });

    afterEach(() => {
      _instance._testParameterIsProvided.restore();
      _instance._getValue.restore();
      _instance._testIsRequired.restore();
    });

    it('should call related methods and return a result', () => {
      test({
        source: 'source',
        name: 'name',
        val: 'value',
        required: true,
        expected: 'value'
      });
    });
  });

  describe('_getValue', () => {
    function test({ params, instanceSource, expected }) {
      _instance.source = instanceSource;
      let actual = _instance._getValue(params);
      should(actual).eql(expected);
    }

    it('should use instance.source when source parameter is undefined', () => {
      test({
        params: { source: undefined, name: 'login' },
        instanceSource: { login: 'u2' },
        expected: 'u2'
      });
    });

    it('should use source parameter when it\'s undefined', () => {
      test({
        params: { source: { login: 'u1' }, name: 'login' },
        instanceSource: { login: 'u2' },
        expected: 'u1'
      });
    });
  });

  describe('_testParameterIsProvided', () => {
    function test({ params, expected }) {
      if (expected instanceof Error) {
        should(() => _instance._testParameterIsProvided(params)).throw(expected);
      } else {
        _instance._testParameterIsProvided(params);
      }
    }

    it('should throw Error when param is undefined', () => {
      test({
        params: { paramName: 'name' },
        expected: new Error('Incorrect parse parameter, name is not provided')
      });
    });

    it('shouldn\t throw error when param is defined', () => {
      test({
        params: { param: 'u1', paramName: 'name' },
        expected: null
      });
    });
  });

  describe('_testIsRequired', () => {
    function test({ params, expected }) {
      if (expected instanceof Error) {
        should(() => _instance._testIsRequired(params)).throw(expected);
      } else {
        _instance._testIsRequired(params);
      }
    }

    it('should throw Error when required is true and val is undefined', () => {
      test({
        params: { name: 'login', val: undefined, required: true },
        expected: new Error('login is required')
      });
    });

    it('shouldn\'t throw error when required is false and val is undefined', () => {
      test({
        params: { name: 'login', val: undefined, required: false },
        expected: null
      });
    });

    it('shouldn\'t throw error when required is true and val is not undefined', () => {
      test({
        params: { name: 'login', val: 'u1', required: true },
        expected: null
      });
    });

    it('shouldn\'t throw error when required is false and val is defined', () => {
      test({
        params: { name: 'login', val: 'u1', required: false },
        expected: null
      });
    });
  });

  describe('_testNotIsNaN', () => {
    function test({ params, expected }) {
      if (expected instanceof Error) {
        should(() => _instance._testNotIsNaN(params)).throw(expected);
      } else {
        _instance._testNotIsNaN(params);
      }
    }

    it('should throw Error when val is NAN', () => {
      test({
        params: { name: 'id', val: NaN },
        expected: new Error('id must be a number')
      });
    });

    it('shouldn\'t throw error when val is a number', () => {
      test({
        params: { name: 'id', val: 11 },
        expected: null
      });
    });
  });

  describe('_testIsValidMoment', () => {
    function test({ params, expected }) {
      if (expected instanceof Error) {
        should(() => _instance._testIsValidMoment(params)).throw(expected);
      } else {
        _instance._testIsValidMoment(params);
      }
    }

    it('should throw Error when val is not a valid moment object', () => {
      test({
        params: { name: 'birthdate', val: moment('invalid date', moment.defaultFormat) },
        expected: new Error('birthdate must be a date')
      });
    });

    it('shouldn\'t throw error when val is a valid moment object', () => {
      test({
        params: { name: 'birthdate', val: moment() },
        expected: null
      });
    });
  });

  describe('_testMin', () => {
    function test({ params, expected }) {
      if (expected instanceof Error) {
        should(() => _instance._testMin(params)).throw(expected);
      } else {
        _instance._testMin(params);
      }
    }

    it('should throw Error when min is defined and val is less than min', () => {
      test({
        params: { name: 'age', val: 10, min: 20 },
        expected: new Error('age must be greater than or equal to 20')
      });
    });

    it('shouldn\'t throw error when min is undefined', () => {
      test({
        params: { name: 'age', val: 10, min: undefined },
        expected: null
      });
    });

    it('shouldn\'t throw error when min is defined and val is greater than min', () => {
      test({
        params: { name: 'age', val: 10, min: 9 },
        expected: null
      });
    });
  });

  describe('_testMax', () => {
    function test({ params, expected }) {
      if (expected instanceof Error) {
        should(() => _instance._testMax(params)).throw(expected);
      } else {
        _instance._testMax(params);
      }
    }

    it('should throw Error when min is defined and val is greater than max', () => {
      test({
        params: { name: 'age', val: 30, max: 20 },
        expected: new Error('age must be less than or equal to 20')
      });
    });

    it('shouldn\'t throw error when max is undefined', () => {
      test({
        params: { name: 'age', val: 30, max: undefined },
        expected: null
      });
    });

    it('shouldn\'t throw error when max is defined and val is less than max', () => {
      test({
        params: { name: 'age', val: 30, max: 31 },
        expected: null
      });
    });
  });

  describe('_throwUnprocessableRequestError', () => {
    it('should throw Error', () => {
      let message = 'UnprocessableRequestError';
      let expected = new Error('UnprocessableRequestError');
      should(() => _instance._throwUnprocessableRequestError(message)).throw(expected);
    });
  });
});
