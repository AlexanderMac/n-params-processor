'use strict';

const _         = require('lodash');
const sinon     = require('sinon');
const should    = require('should');
const nassert   = require('n-assert');
const testUtil  = require('../../test-util');
const IntParser = require('../../../src/parsers/number-parsers/int-parser');

describe('parsers / number-parsers / int-parser', () => {
  function registerTest(params) {
    params.Parser = IntParser;
    testUtil.registerTest(params);
  }

  function getParams(ex) {
    let def = {
      val: 18,
      name: 'age'
    };
    return _.extend(def, ex);
  }

  describe('static getInstance', () => {
    function test() {
      let actual = IntParser.getInstance({});
      should(actual).be.instanceof(IntParser);
    }

    it('should create and return instance of IntParser', () => {
      return test();
    });
  });

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(IntParser, 'getInstance');
    });

    afterEach(() => {
      IntParser.getInstance.restore();
    });

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      };
      sinon.spy(mock, 'parse');
      IntParser.getInstance.returns(mock);

      let actual = IntParser.parse(params);
      nassert.assert(actual, expected);

      nassert.validateCalledFn({ srvc: IntParser, fnName: 'getInstance', expectedArgs: params });
      nassert.validateCalledFn({ srvc: mock, fnName: 'parse', expectedArgs: '_without-args_' });
    }

    it('should create instance of IntParser, call parse method and return result', () => {
      let params = 'params';
      let expected = 'ok';

      return test({ params, expected });
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
