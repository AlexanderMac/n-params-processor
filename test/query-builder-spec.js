'use strict';

const _            = require('lodash');
const sinon        = require('sinon');
const should       = require('should');
const QueryBuilder = require('../src/query-builder');

describe('query-builder', () => {
  let _instance;

  function registerParseParamTest({ parseFnName, dataFieldName, testName, params, expected }) {
    it(testName, () => {
      _instance.fields = [];
      if (expected instanceof Error) {
        should(() => _instance[parseFnName](params)).throw(expected);
      } else {
        _instance[parseFnName](params);
        should(_instance[dataFieldName]).eql(expected);
      }
    });
  }

  function registerCommonParseParamTests({ parseFnName, dataFieldName }) {
    function getParams(overrides) {
      let def = {
        source: { login: 'u1' },
        name: 'login'
      };
      return _.extend(def, overrides);
    }

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should throw Error when required is true and val is undefined',
      params: getParams({ source: { login: undefined }, required: true }),
      expected: new Error('login is required')
    });
  }

  beforeEach(() => {
    _instance = new QueryBuilder();
  });

  describe('constructor', () => {
    function test({ params, expected }) {
      let instance = new QueryBuilder(params);
      should(instance.source).eql(expected.source);
      should(instance.filter).eql(expected.filter);
      should(instance.fields).eql(expected.fields);
      /* TODO: not implemented
      should(instance.pagination).eql(expected.pagination);
      should(instance.sorting).eql(expected.sorting);
      */
      should(instance.dest).equal(instance.filter);
    }

    it('should init instance internal fields when baseFilter is not provided', () => {
      let params = {
        source: 'source'
      };
      let expected = {
        source: 'source',
        filter: {},
        fields: '',
        /* TODO: not implemented
        pagination: { page: 1, count: 10 },
        sorting: {}
        */
      };
      test({ params, expected });
    });

    it('should init instance internal fields', () => {
      let params = {
        baseFilter: { id: 1 },
        source: 'source'
      };
      let expected = {
        source: 'source',
        filter: { id: 1 },
        fields: '',
        /* TODO: not implemented
        pagination: { page: 1, count: 10 },
        sorting: {}
        */
      };
      test({ params, expected });
    });
  });

  describe('parseIn', () => {
    let parseFnName = 'parseIn';
    let dataFieldName = 'filter';

    function getParams(overrides) {
      let def = {
        source: { in: [11, 12] },
        name: 'in',
        field: 'id'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests({ parseFnName, dataFieldName });

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should throw Error when field is not provided',
      params: getParams({ source: { in: [11, 12] }, field: null }),
      expected: new Error('Incorrect parse parameter, field is not provided')
    });

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should throw Error when provided val contains incorrect RDBMS id',
      params: getParams({ source: { in: [11, 'not valid id', 13] }}),
      expected: new Error('in must contain a list of valid IDs')
    });

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should set parsed value to instance.filter when parameter is valid',
      params: getParams(),
      expected: { $$in: { fieldName: 'id', fieldVal: [11, 12] }}
    });
  });

  describe('parseNin', () => {
    let parseFnName = 'parseNin';
    let dataFieldName = 'filter';

    function getParams(overrides) {
      let def = {
        source: { nin: [11, 12] },
        name: 'nin',
        field: 'id'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests({ parseFnName, dataFieldName });

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should throw Error when field is not provided',
      params: getParams({ source: { nin: [11, 12] }, field: null }),
      expected: new Error('Incorrect parse parameter, field is not provided')
    });

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should throw Error when provided val contains incorrect RDBMS id',
      params: getParams({ source: { nin: [11, 'not valid id', 13] }}),
      expected: new Error('nin must contain a list of valid IDs')
    });

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should set parsed value to instance.filter when parameter is valid',
      params: getParams(),
      expected: { $$nin: { fieldName: 'id', fieldVal: [11, 12] }}
    });
  });

  describe('parseFields', () => {
    let parseFnName = 'parseFields';
    let dataFieldName = 'fields';

    function getParams(overrides) {
      let def = {
        source: { fields: 'id name' },
        name: 'fields',
        def: 'id',
        allowed: 'id name email'
      };
      return _.extend(def, overrides);
    }

    registerCommonParseParamTests({ parseFnName, dataFieldName });

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should throw Error when provided val is not a string with space separated values',
      params: getParams({ source: { fields: 11 }}),
      expected: new Error('fields must be a space separated string of fields')
    });

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should throw Error when provided val is contains not allowed field',
      params: getParams({ source: { fields: 'id password' }}),
      expected: new Error('fields must be a space separated string of fields')
    });

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should don\'t change instance.fields when required is false and val is undefined',
      params: getParams({ source: { fields: null }, required: false }),
      expected: 'id'
    });

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should set instance.fields=def when parameter is valid, but source.fields is undefined',
      params: getParams({ source: {}}),
      expected: 'id'
    });

    registerParseParamTest({
      parseFnName,
      dataFieldName,
      testName: 'should set instance.fields=allowed when parameter is valid',
      params: getParams(),
      output: {},
      expected: 'id name'
    });
  });

  describe('build', () => {
    function test({ dbProvider, expected }) {
      if (expected instanceof Error) {
        should(() => _instance.build(dbProvider)).throw(expected);
      } else {
        let actual = _instance.build(dbProvider);
        should(actual).eql(expected);
      }
    }

    beforeEach(() => {
      sinon.stub(_instance, '_buildMongooseQuery').callsFake(() => 'mongooseQuery');
      sinon.stub(_instance, '_buildSequelizeQuery').callsFake(() => 'sequelizeQuery');
    });

    afterEach(() => {
      _instance._buildMongooseQuery.restore();
      _instance._buildSequelizeQuery.restore();
    });

    it('should throw Error when dbProvider is not defined', () => {
      let dbProvider = null;
      let expected = new Error('dbProvider is not defined');
      test({ dbProvider, expected });
    });

    it('should throw Error when dbProvider is not supported', () => {
      let dbProvider = 'Unsupported dbProvider';
      let expected = new Error('Unsupported dbPovider: Unsupported dbProvider');
      test({ dbProvider, expected });
    });

    it('should call instance._buildMongooseQuery when dbProvider is mongoose', () => {
      let dbProvider = 'mongoose';
      let expected = 'mongooseQuery';
      test({ dbProvider, expected });
    });

    it('should call instance._buildMongooseQuery when dbProvider is sequelize', () => {
      let dbProvider = 'sequelize';
      let expected = 'sequelizeQuery';
      test({ dbProvider, expected });
    });
  });

  describe('_buildMongooseQuery', () => {
    function test(expected) {
      _.extend(_instance, {
        filter: {
          firstName: 'jonh',
          $$nin: {
            fieldName: 'id',
            fieldVal: [1, 2, 3]
          }
        },
        fields: 'id firstName age'
      });
      /* TODO: not implemented
      _instance.pagination = 'pagination';
      _instance.sorting = 'sorting';
      */

      let actual = _instance._buildMongooseQuery();
      should(actual).eql(expected);
    }

    it('should return instance.data when dbProvider is mongoose', () => {
      let expected = {
        filter: {
          firstName: 'jonh',
          id: { $nin: [1, 2, 3] }
        },
        fields: 'id firstName age',
        /* TODO: not implemented
        pagination: 'pagination',
        sorting: 'sorting'
        */
      };
      test(expected);
    });
  });

  describe('_buildSequelizeQuery', () => {
    function test(expected) {
      _.extend(_instance, {
        filter: {
          firstName: 'jonh',
          $$nin: {
            fieldName: 'id',
            fieldVal: [1, 2, 3]
          }
        },
        fields: 'id firstName age'
      });
      /* TODO: not implemented
      _instance.pagination = 'pagination';
      _instance.sorting = 'sorting';
      */

      let actual = _instance._buildSequelizeQuery();
      should(actual).eql(expected);
    }

    it('should return instance.data when dbProvider is mongoose', () => {
      let expected = {
        filter: {
          firstName: 'jonh',
          id: { $notIn: [1, 2, 3] }
        },
        fields: ['id', 'firstName', 'age'],
        /* TODO: not implemented
        pagination: 'pagination',
        sorting: 'sorting'
        */
      };
      test(expected);
    });
  });
});
