'use strict';

const _          = require('lodash');
const moment     = require('moment');
const should     = require('should');
const rewire     = require('rewire');
const paramsProc = rewire('../src/params-processor');

describe('params-processor', () => {
  function registerParseParamTest({ parseFnName, testName, opts, output, expected }) {
    it(testName, () => {
      if (expected instanceof Error) {
        should(() => paramsProc[parseFnName](opts, output)).throw(expected.message);
      } else {
        paramsProc[parseFnName](opts, output);
        should(output).eql(expected);
      }
    });
  }

  function registerCommonParseParamTests(parseFnName, opts) {
    function getOpts(overrides) {
      let def = {
        from: { login: 'u1' },
        name: 'login'
      };
      return _.extend(def, overrides);
    }

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when opts.from is not provided',
      opts: getOpts({ from: undefined }),
      output: { id: 1 },
      expected: new Error('Impossible parse parameter. From is not provided')
    });

    if (!opts || opts.assertName) {
      registerParseParamTest({
        parseFnName,
        testName: 'should throw Error when opts.name is not provided',
        opts: getOpts({ name: undefined }),
        output: { id: 1 },
        expected: new Error('Impossible parse parameter. Name is not provided')
      });
    }

    if (!opts || opts.assertRequiedAndUndefined) {
      registerParseParamTest({
        parseFnName,
        testName: 'should throw Error when opts.required is true and val is undefined',
        opts: getOpts({ from: { login: undefined }, required: true }),
        output: { id: 1 },
        expected: new Error('login is required')
      });
    }

    if (!opts || opts.assertNotRequiedAndUndefined) {
      registerParseParamTest({
        parseFnName,
        testName: 'shouldn\'t change output and throw error when opts.required is false and val is undefined',
        opts: getOpts({ from: { login: undefined }, required: false }),
        output: { id: 1 },
        expected: { id: 1 }
      });
    }
  }

  describe('registerCustomErrorType', () => {
    function test(expected) {
      let actual = paramsProc.__get__('_CustomErrorType');
      should(actual).eql(expected);
    }

    afterEach(() => {
      paramsProc.__set__('_CustomErrorType', Error);
    });

    it('should use defaul Error type when register function is not called', () => {
      test(Error);
    });

    it('should use CustomError type when register function is called', () => {
      let CustomErrorType = () => {};
      paramsProc.registerCustomErrorType(CustomErrorType);

      test(CustomErrorType);
    });
  });

  describe('getEmptyParams', () => {
    function test(params, expected) {
      let actual = paramsProc.getEmptyParams(params);
      should(actual).eql(expected);
    }

    it('should return default params object', () => {
      let params = null;
      let expected = {
        filter: {},
        fields: []
      };
      test(params, expected);
    });

    it('should return params object with predefined filter', () => {
      let params = {
        name: 'John'
      };
      let expected = {
        filter: { name: 'John' },
        fields: []
      };
      test(params, expected);
    });
  });

  describe('getEmptyDataObject', () => {
    function test(params, expected) {
      let actual = paramsProc.getEmptyDataObject(params);
      should(actual).eql(expected);
    }

    it('should return default data object', () => {
      test(null, {});
    });

    it('should return data object with predefined values', () => {
      test({ account: 1 }, { account: 1 });
    });
  });

  describe('parseDataObject', () => {
    function test(opts, data, expected) {
      paramsProc.parseDataObject(opts, data);
      should(data).eql(expected);
    }

    it('should unchange data when opts.from is empty', () => {
      let opts = {
        from: {},
        allowed: ['id', 'name']
      };
      let data = { id: 1 };
      let expected = { id: 1 };

      test(opts, data, expected);
    });

    it('should unchange data when no one field from opts.from are in opts.allowed', () => {
      let opts = {
        from: { name: 'user1', email: 'user1@mail.com' },
        allowed: ['login', 'role']
      };
      let data = { id: 1 };
      let expected = { id: 1 };

      test(opts, data, expected);
    });

    it('should update data when some fields from opts.from are in opts.allowed', () => {
      let opts = {
        from: { name: 'user1', email: 'user1@mail.com' },
        allowed: ['name', 'login']
      };
      let data = { id: 1 };
      let expected = { id: 1, name: 'user1' };

      test(opts, data, expected);
    });
  });

  describe('parseString', () => {
    let parseFnName = 'parseString';

    function getOpts(overrides) {
      let def = {
        from: { login: 'u1' },
        name: 'login'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when opts.allowed is defined and val is not in it',
      opts: getOpts({ allowed: ['u2', 'u3'] }),
      output: { id: 1 },
      expected: new Error('login has incorrect value')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid',
      opts: getOpts(),
      output: { id: 1 },
      expected: { id: 1, login: 'u1' }
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid and val is empty string',
      opts: getOpts({ from: { login: '' }}),
      output: { id: 1 },
      expected: { id: 1, login: '' }
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid and val was a number',
      opts: getOpts({ from: { age: '25' }, name: 'age' }),
      output: { id: 1 },
      expected: { id: 1, age: '25' }
    });
  });

  describe('parseInt', () => {
    let parseFnName = 'parseInt';

    function getOpts(overrides) {
      let def = {
        from: { age: '25' },
        name: 'age'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val can\'t be convered to integer',
      opts: getOpts({ from: { age: 'not an IntegerNumber' }}),
      output: { id: 1 },
      expected: new Error('age must be a number')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when opts.min is defined and provided val is less than opts.min',
      opts: getOpts({ min: 30 }),
      output: { id: 1 },
      expected: new Error('age must be greater than or equal to 30')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when opts.max is defined and provided val is greater than opts.max',
      opts: getOpts({ max: 20 }),
      output: { id: 1 },
      expected: new Error('age must be less than or equal to 20')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid and val is zero',
      opts: getOpts({ from: { age: 0 }}),
      output: { id: 1 },
      expected: { id: 1, age: 0 }
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid',
      opts: getOpts(),
      output: { id: 1 },
      expected: { id: 1, age: 25 }
    });
  });

  describe('parseFloat', () => {
    let parseFnName = 'parseFloat';

    function getOpts(overrides) {
      let def = {
        from: { age: '25.5' },
        name: 'age'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val can\'t be convered to float',
      opts: getOpts({ from: { age: 'not a FloatNumber' }}),
      output: { id: 1 },
      expected: new Error('age must be a number')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when opts.min is defined and provided val is less than opts.min',
      opts: getOpts({ min: 30 }),
      output: { id: 1 },
      expected: new Error('age must be greater than or equal to 30')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when opts.max is defined and provided val is greater than opts.max',
      opts: getOpts({ max: 20 }),
      output: { id: 1 },
      expected: new Error('age must be less than or equal to 20')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid',
      opts: getOpts(),
      output: { id: 1 },
      expected: { id: 1, age: 25.5 }
    });
  });

  describe('parseDate', () => {
    let parseFnName = 'parseDate';

    function getOpts(overrides) {
      let def = {
        from: { birthDate: '1998-11-07' },
        name: 'birthDate'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val can\'t be convered to date',
      opts: getOpts({ from: { birthDate: 'not a Date' }}),
      output: { id: 1 },
      expected: new Error('birthDate must be a date')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid',
      opts: getOpts(),
      output: { id: 1 },
      expected: { id: 1, birthDate: moment('1998-11-07', moment.defaultFormat) }
    });
  });

  describe('parseId', () => {
    let parseFnName = 'parseId';

    function getOpts(overrides) {
      let def = {
        from: { id: 11 },
        name: 'id'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName, { assertName: false });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val is not a correct RDBMS id',
      opts: getOpts({ from: { id: 'not valid id' }}),
      output: {},
      expected: new Error('id must be a valid ID')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid',
      opts: getOpts(),
      output: {},
      expected: { id: 11 }
    });
  });

  describe('parseIdList', () => {
    let parseFnName = 'parseIdList';

    function getOpts(overrides) {
      let def = {
        from: { ids: [11, 12] },
        name: 'ids'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName);

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val contains incorrect RDBMS id',
      opts: getOpts({ from: { ids: [11, 'not valid id', 13] }}),
      output: {},
      expected: new Error('ids must be a valid list of IDs')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid',
      opts: getOpts(),
      output: {},
      expected: { ids: [11, 12] }
    });
  });

  describe('parseObjectId', () => {
    let parseFnName = 'parseObjectId';

    function getOpts(overrides) {
      let def = {
        from: { id: '583c9a0906c20c1c91103fb4' },
        name: 'id'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName, { assertName: false });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val is not a correct MongoDB ObjectId',
      opts: getOpts({ from: { id: 'not valid ObjectId' }}),
      output: {},
      expected: new Error('id must be a valid ObjectId')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid',
      opts: getOpts(),
      output: {},
      expected: { id: '583c9a0906c20c1c91103fb4' }
    });
  });

  describe('parseIn', () => {
    let parseFnName = 'parseIn';

    function getOpts(overrides) {
      let def = {
        from: { in: [11, 12] },
        name: 'in'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName, { assertName: false });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val contains incorrect RDBMS id',
      opts: getOpts({ from: { in: [11, 'not valid id', 13] }}),
      output: {},
      expected: new Error('in must contain a list of valid IDs')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid',
      opts: getOpts(),
      output: {},
      expected: { id: { $in: [11, 12] }}
    });
  });

  describe('parseNin', () => {
    let parseFnName = 'parseNin';

    function getOpts(overrides) {
      let def = {
        from: { nin: [11, 12] },
        name: 'nin'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName, { assertName: false });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val contains incorrect RDBMS id',
      opts: getOpts({ from: { nin: [11, 'not valid id', 13] }}),
      output: {},
      expected: new Error('nin must contain a list of valid IDs')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid',
      opts: getOpts(),
      output: {},
      expected: { id: { $notIn: [11, 12] }}
    });
  });

  describe('parseFields', () => {
    let parseFnName = 'parseFields';

    function getOpts(overrides) {
      let def = {
        from: { fields: 'id name' },
        name: 'fields',
        def: 'id',
        allowed: 'id name email'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests(parseFnName, { assertName: false, assertRequiedAndUndefined: false, assertNotRequiedAndUndefined: false });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val is not a string with space separated values',
      opts: getOpts({ from: { fields: 11 }}),
      output: {},
      expected: new Error('fields must be a space separated string of fields')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should throw Error when provided val is contains not allowed field',
      opts: getOpts({ from: { fields: 'id password' }}),
      output: {},
      expected: new Error('fields must be a space separated string of fields')
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add default value to output when all opts are valid and from.fields is undefined',
      opts: getOpts({ from: {}}),
      output: {},
      expected: { fields: ['id'] }
    });

    registerParseParamTest({
      parseFnName,
      testName: 'should add parsed value to output when all opts are valid',
      opts: getOpts(),
      output: {},
      expected: { fields: ['id', 'name'] }
    });
  });
});
