'use strict';

const _          = require('lodash');
const sinon      = require('sinon');
const should     = require('should');
const testUtil   = require('../test-util');
const BaseParser = require('../../src/parsers/base-parser');

describe('parsers / base-parser', () => {
  function registerTest(params) {
    params.Parser = BaseParser;
    testUtil.registerTest(params);
  }

  describe('constructor', () => {
    function test({ params, expected }) {
      let instance = new BaseParser(params);
      should(instance.val).equal(expected.val);
      should(instance.name).equal(expected.name);
      should(instance.required).equal(expected.required);
      should(instance.min).equal(expected.min);
      should(instance.max).equal(expected.max);
      should(instance.allowed).equal(expected.allowed);
    }

    it('should create an instance and initialize internal fields', () => {
      let params = {
        val: 'user1',
        name: 'login',
        required: false,
        min: 1,
        max: 9,
        allowed: ['user1', 'user2']
      };
      let expected = _.clone(params);

      test({ params, expected });
    });

    it('should create an instance and initialize internal fields (without optional fields)', () => {
      let params = {
        val: 'user1',
        name: 'login'
      };
      let expected = {
        val: 'user1',
        name: 'login',
        required: false
      };

      test({ params, expected });
    });
  });

  describe('parse', () => {
    function test() {
      let instance = new BaseParser();
      sinon.stub(instance, '_validateRequired');

      instance.parse();

      should(instance._validateRequired.calledOnce).equal(true);
    }

    it('should call related methods', () => {
      test();
    });
  });

  describe('_validateRequired', () => {
    registerTest({
      methodName: '_validateRequired',
      testName: 'should throw Error when required is true and val is undefined',
      params: { name: 'login', val: undefined, required: true },
      expected: new Error('login is required')
    });

    registerTest({
      methodName: '_validateRequired',
      testName: 'shouldn\'t throw error when required is false and val is undefined',
      params: { name: 'login', val: undefined, required: false }
    });

    registerTest({
      methodName: '_validateRequired',
      testName: 'shouldn\'t throw error when required is true and val is not undefined',
      params: { name: 'login', val: 'u1', required: true }
    });

    registerTest({
      methodName: '_validateRequired',
      testName: 'shouldn\'t throw error when required is false and val is defined',
      params: { name: 'login', val: 'u1', required: false }
    });
  });

  describe('_validateAllowed', () => {
    registerTest({
      methodName: '_validateAllowed',
      testName: 'should throw Error when allowed is defined and doesn\'t contain val',
      params: { name: 'login', val: 'u1', allowed: ['u2', 'u3'] },
      expected: new Error('login is incorrect, must be one of u2,u3')
    });

    registerTest({
      methodName: '_validateAllowed',
      testName: 'shouldn\'t throw error when allowed is undefined',
      params: { name: 'login', val: 'u1', allowed: undefined }
    });

    registerTest({
      methodName: '_validateAllowed',
      testName: 'shouldn\'t throw error when allowed is defined and contains val',
      params: { name: 'login', val: 'u1', allowed: ['u1', 'u2', 'u3'] }
    });
  });

  describe('_throwIncorrectParamError', () => {
    function test({ message, expected }) {
      let instance = new BaseParser();
      should(() => instance._throwIncorrectParamError(message)).throw(expected);
    }

    it('should throw Error', () => {
      test({
        message: 'IncorrectParamError',
        expected: new Error('IncorrectParamError')
      });
    });
  });
});
