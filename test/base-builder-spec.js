'use strict';

const _           = require('lodash');
const sinon       = require('sinon');
const should      = require('should');
const nassert     = require('n-assert');
const BaseBuilder = require('../src/base-builder');
const parsers     = require('../src/parsers');

describe('base-builder', () => {
  function validateRegisteredParseFunctions(instance) {
    let instanceParseFnCount = _.chain(instance)
      .keys()
      .filter(name => _.isFunction(instance[name]) && _.startsWith(name, 'parse'))
      .value()
      .length;
    should(instanceParseFnCount).equal(11);
    should(_.isFunction(instance.parseString)).equal(true);
    should(_.isFunction(instance.parseDate)).equal(true);
    should(_.isFunction(instance.parseJson)).equal(true);
    should(_.isFunction(instance.parseBool)).equal(true);
    should(_.isFunction(instance.parseNumber)).equal(true);
    should(_.isFunction(instance.parseInt)).equal(true);
    should(_.isFunction(instance.parseFloat)).equal(true);
    should(_.isFunction(instance.parseRegexp)).equal(true);
    should(_.isFunction(instance.parseObjectId)).equal(true);
    should(_.isFunction(instance.parseArray)).equal(true);
  }

  describe('constructor', () => {
    function test({ params, expected }) {
      let instance = new BaseBuilder(params);
      should(instance.source).eql(expected.source);
      should(instance.data).eql(expected.data);
      validateRegisteredParseFunctions(instance);
    }

    it('should create an instance and set source to undefined, data to empty object when params are not provided', () => {
      let params = undefined;
      let expected = {
        source: undefined,
        data: { _temp_: {}}
      };

      test({ params, expected });
    });

    it('should create an instance and set source to params.source, data to empty object when only params.source is provided', () => {
      let params = {
        source: { login: 'u1' }
      };
      let expected = {
        source: { login: 'u1' },
        data: { _temp_: {}}
      };

      test({ params, expected });
    });

    it('should create an instance and set source to params.source, data to params.data when all params are provided', () => {
      let params = {
        source: { login: 'u1' },
        data: { id: 1 }
      };
      let expected = {
        source: { login: 'u1' },
        data: {
          _temp_: {},
          id: 1
        }
      };

      test({ params, expected });
    });
  });

  describe('_registerParseFunctions', () => {
    function test() {
      let instance = new BaseBuilder();
      validateRegisteredParseFunctions(instance);
    }

    it('should register parse<ParserName> function for each Parser', () => {
      test();
    });
  });

  describe('_registerOneParseFunction', () => {
    function test({ parserName, expected }) {
      let instance = new BaseBuilder();

      let actual = instance._registerOneParseFunction(parserName);
      should(actual).eql(expected);
      should(_.isFunction(instance.parseSuper)).equal(true);
    }

    it('should add new parse<parserName> instance.method and return parse<parser> function name', () => {
      let parserName = 'SuperParser';
      let expected = 'parseSuper';

      test({ parserName, expected });
    });
  });

  describe('parse<Parser>', () => {
    beforeEach(() => {
      sinon.stub(parsers.IntParser, 'parse').returns(20);
    });

    afterEach(() => {
      parsers.IntParser.parse.restore();
    });

    function test({ params, expected, expectedParseArgs }) {
      let instance = new BaseBuilder();

      let actual = instance.parseInt(params);
      should(actual).eql(expected);

      nassert.validateCalledFn({ srvc: parsers.IntParser, fnName: 'parse', expectedArgs: expectedParseArgs });
    }

    it('should call registered parser, and return value', () => {
      let params = {
        source: { age: '20' },
        name: 'age',
        az: 'yoa',
        required: true,
        min: 18
      };
      let expected = {
        name: 'yoa',
        val: 20
      };
      let expectedParseArgs = {
        required: true,
        min: 18,
        val: '20'
      };

      test({ params, expected, expectedParseArgs });
    });
  });

  describe('_getParseFunctionName', () => {
    function test({ parserName, expected }) {
      let instance = new BaseBuilder();

      let actual = instance._getParseFunctionName(parserName);
      should(actual).eql(expected);
    }

    it('should return correct parse function name', () => {
      let parserName = 'IntParser';
      let expected = 'parseInt';

      test({ parserName, expected });
    });
  });

  describe('_getValue', () => {
    function test({ params, source, expected }) {
      let instance = new BaseBuilder({ source });

      let actual = instance._getValue(params);
      nassert.assert(actual, expected, true);
    }

    it('should use instance.source when params.source parameter is undefined', () => {
      test({
        params: { source: undefined, name: 'login' },
        source: { login: 'u2' },
        expected: 'u2'
      });
    });

    it('should use params.source parameter when it is defined', () => {
      test({
        params: { source: { login: 'u1' }, name: 'login' },
        source: { login: 'u2' },
        expected: 'u1'
      });
    });
  });

  describe('_getParamName', () => {
    function test({ data, params, expected }) {
      let instance = new BaseBuilder();
      instance.data = data;

      if (_.isError(expected)) {
        should(instance._getParamName.bind(instance, params)).throw(expected);
      } else {
        let actual = instance._getParamName(params);
        should(actual).eql(expected);
      }
    }

    it('should throw Error when paramName is not unique in the scope of instance.data and params.to is undefined', () => {
      let data = {
        login: 'u1'
      };
      let params = {
        name: 'login'
      };
      let expected = new Error('Parameter "login" is already used. Use another name of remove duplicate');

      test({ data, params, expected });
    });

    it('should not throw Error when paramName is unique in the scope of instance.data.to', () => {
      let data = {
        login: 'u1',
        _filter_: {}
      };
      let params = {
        name: 'login',
        to: '_filter_'
      };
      let expected = 'login';

      test({ data, params, expected });
    });

    it('should not throw Error and return paramName when it is unique in the scope of instance.data', () => {
      let data = {
        login: 'u1',
        _filter_: {}
      };
      let params = {
        name: 'login',
        az: 'username'
      };
      let expected = 'username';

      test({ data, params, expected });
    });
  });

  describe('_processResult', () => {
    function test({ data, params, expected }) {
      let instance = new BaseBuilder();
      instance.data = data;

      let actual = instance._processResult(params);
      should(instance.data).eql(expected.data);
      should(actual).eql(expected.result);
    }

    it('should extend instance.data when params.to is undefined', () => {
      let data = {};
      let params = {
        paramName: 'login',
        paramVal: 'user1'
      };
      let expected = {
        data: { login: 'user1' },
        result: { name: 'login', val: 'user1' }
      };

      test({ data, params, expected });
    });

    it('should extend instance.data.to when params.to isdefined', () => {
      let data = {
        _filter_: {}
      };
      let params = {
        paramName: 'login',
        paramVal: 'user1',
        to: '_filter_'
      };
      let expected = {
        data: {
          _filter_: { login: 'user1' }
        },
        result: { name: 'login', val: 'user1' }
      };

      test({ data, params, expected });
    });
  });
});
