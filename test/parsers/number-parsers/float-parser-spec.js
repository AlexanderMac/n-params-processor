const _ = require('lodash');
const sinon = require('sinon');
const should = require('should');
const nassert = require('n-assert');
const testUtil = require('../../test-util');
const FloatParser = require('../../../src/parsers/number-parsers/float-parser');

describe('parsers / number-parsers / float-parser', () => {
  function registerTest(params) {
    params.Parser = FloatParser;
    testUtil.registerTest(params);
  }

  function getParams(ex) {
    let def = {
      val: 18.5,
      name: 'age'
    };
    return _.extend(def, ex);
  }

  describe('static getInstance', () => {
    function test() {
      let actual = FloatParser.getInstance({});
      should(actual).be.instanceof(FloatParser);
    }

    it('should create and return instance of FloatParser', () => {
      return test();
    });
  });

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(FloatParser, 'getInstance');
    });

    afterEach(() => {
      FloatParser.getInstance.restore();
    });

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      };
      sinon.spy(mock, 'parse');
      FloatParser.getInstance.returns(mock);

      let actual = FloatParser.parse(params);
      nassert.assert(actual, expected);

      nassert.assertFn({ inst: FloatParser, fnName: 'getInstance', expectedArgs: params });
      nassert.assertFn({ inst: mock, fnName: 'parse', expectedArgs: '_without-args_' });
    }

    it('should create instance of FloatParser, call parse method and return result', () => {
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
      testName: 'should set instance.val to a float number when val is a float number string',
      params: getParams({ val: '18.2' }),
      expected: 18.2
    });

    registerTest({
      methodName: '_convert',
      testName: 'should set instance.val to a float number when val is an integer number string',
      params: getParams({ val: '18' }),
      expected: 18.0
    });

    registerTest({
      methodName: '_convert',
      testName: 'should set instance.val to a float number when val is a float number',
      params: getParams({ val: 18.2 }),
      expected: 18.2
    });

    registerTest({
      methodName: '_convert',
      testName: 'should set instance.val to a float number when val is an integer number',
      params: getParams({ val: 18.0 }),
      expected: 18.0
    });
  });
});
