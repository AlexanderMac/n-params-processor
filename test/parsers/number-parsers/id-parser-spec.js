'use strict';

const _        = require('lodash');
const sinon    = require('sinon');
const should   = require('should');
const nassert  = require('n-assert');
const testUtil = require('../../test-util');
const IdParser = require('../../../src/parsers/number-parsers/id-parser');

describe('parsers / number-parsers / id-parser', () => {
  function registerTest(params) {
    params.Parser = IdParser;
    testUtil.registerTest(params);
  }

  function getParams(ex) {
    let def = {
      val: 18,
      name: 'documentId'
    };
    return _.extend(def, ex);
  }

  describe('static getInstance', () => {
    function test() {
      let actual = IdParser.getInstance({});
      should(actual).be.instanceof(IdParser);
    }

    it('should create and return instance of IdParser', () => {
      return test();
    });
  });

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(IdParser, 'getInstance');
    });

    afterEach(() => {
      IdParser.getInstance.restore();
    });

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      };
      sinon.spy(mock, 'parse');
      IdParser.getInstance.returns(mock);

      let actual = IdParser.parse(params);
      nassert.assert(actual, expected);

      nassert.assertFn({ inst: IdParser, fnName: 'getInstance', expectedArgs: params });
      nassert.assertFn({ inst: mock, fnName: 'parse', expectedArgs: '_without-args_' });
    }

    it('should create instance of IdParser, call parse method and return result', () => {
      let params = 'params';
      let expected = 'ok';

      return test({ params, expected });
    });
  });

  describe('constructor', () => {
    function test({ params, expected }) {
      let instance = new IdParser(params);
      should(instance.val).equal(expected.val);
      should(instance.name).equal(expected.name);
      should(instance.min).equal(expected.min);
    }

    it('should create an instance and set min to 1 when min is undefined', () => {
      let params = {
        val: '15',
        name: 'documentId'
      };
      let expected = _.chain(params).clone().extend({ min: 1 }).value();

      test({ params, expected });
    });

    it('should create an instance and set min to 1 when min is 0', () => {
      let params = {
        val: '15',
        name: 'documentId',
        min: 0
      };
      let expected = _.chain(params).clone().extend({ min: 1 }).value();

      test({ params, expected });
    });

    it('should create an instance and set min to 5 when min is 5', () => {
      let params = {
        val: '15',
        name: 'documentId',
        min: 5
      };
      let expected = _.clone(params);

      test({ params, expected });
    });
  });

  describe('_convert', () => {
    registerTest({
      methodName: '_convert',
      testName: 'should set instance.val to NaN when val ca not be converted to a number',
      params: getParams({ val: 'Wrong number' }),
      expected: NaN
    });

    registerTest({
      methodName: '_convert',
      testName: 'should set instance.val to an integer number when val is a float number string',
      params: getParams({ val: '18.2' }),
      expected: 18
    });

    registerTest({
      methodName: '_convert',
      testName: 'should set instance.val to an integer number when val is an integer number string',
      params: getParams({ val: '18' }),
      expected: 18
    });

    registerTest({
      methodName: '_convert',
      testName: 'should set instance.val to an integer number when val is a float number',
      params: getParams({ val: 18.2 }),
      expected: 18
    });

    registerTest({
      methodName: '_convert',
      testName: 'should set instance.val to an integer number when val is an integer number',
      params: getParams({ val: 18 }),
      expected: 18
    });
  });
});
