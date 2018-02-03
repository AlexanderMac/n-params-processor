'use strict';

const _           = require('lodash');
const sinon       = require('sinon');
const should      = require('should');
const nassert     = require('n-assert');
const BaseBuilder = require('../src/base-builder');
const parsers     = require('../src/parsers');

describe('base-builder', () => {
  /*describe.skip('parseString', () => {
    beforeEach(() => {
      sinon.stub(_instance, '_getValue');
      sinon.stub(parsers.StringParser, 'parse');
    });

    afterEach(() => {
      _instance._getValue.restore();
      parsers.StringParser.parse.restore();
    });

    registerParseTest({ parseFnName: 'parseString', parserName: 'StringParser' });
  });
  */

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

    it('should create an instance and set internfal fields', () => {
      let params = 'source';
      let expected = {
        source: 'source',
        data: {}
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
      let instance = new BaseBuilder(source);

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

  describe('_processResult', () => {
    function test({ params, expected }) {
      let instance = new BaseBuilder();

      let actual = instance._processResult(params);
      should(instance.data).eql(expected.data);
      should(actual).eql(expected.result);
    }

    it('should add new field to instance.data and return { name, val } object when az is undefined', () => {
      let params = {
        name: 'login',
        parsedVal: 'user1'
      };
      let expected = {
        data: { login: 'user1' },
        result: { name: 'login', val: 'user1' }
      };

      test({ params, expected });
    });

    it('should add new field to instance.data and return { name: az, val } object when az is defined', () => {
      let params = {
        name: 'login',
        az: 'username',
        parsedVal: 'user1'
      };
      let expected = {
        data: { username: 'user1' },
        result: { name: 'username', val: 'user1' }
      };

      test({ params, expected });
    });
  });
});
