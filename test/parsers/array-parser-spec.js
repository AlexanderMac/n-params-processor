'use strict';

const _            = require('lodash');
const sinon        = require('sinon');
const should       = require('should');
const nassert      = require('n-assert');
const testUtil     = require('../test-util');
const BaseParser   = require('../../src/parsers/base-parser');
const IntParser    = require('../../src/parsers/number-parsers/int-parser');
const CustomParser = require('../../src/parsers/custom-parser');
const ArrayParser  = require('../../src/parsers/array-parser');

describe('parsers / array-parser', () => {
  function registerTest(params) {
    params.Parser = ArrayParser;
    testUtil.registerTest(params);
  }

  function getParams(ex) {
    let def = {
      val: [1, 2, 3],
      name: 'clients',
      itemType: 'Int'
    };
    return _.extend(def, ex);
  }

  describe('static getInstance', () => {
    function test() {
      let actual = ArrayParser.getInstance({});
      should(actual).be.instanceof(ArrayParser);
    }

    it('should create and return instance of ArrayParser', () => {
      return test();
    });
  });

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(ArrayParser, 'getInstance');
    });

    afterEach(() => {
      ArrayParser.getInstance.restore();
    });

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      };
      sinon.spy(mock, 'parse');
      ArrayParser.getInstance.returns(mock);

      let actual = ArrayParser.parse(params);
      nassert.assert(actual, expected);

      nassert.validateCalledFn({ srvc: ArrayParser, fnName: 'getInstance', expectedArgs: params });
      nassert.validateCalledFn({ srvc: mock, fnName: 'parse', expectedArgs: '_without-args_' });
    }

    it('should create instance of ArrayParser, call parse method and return result', () => {
      let params = 'params';
      let expected = 'ok';

      return test({ params, expected });
    });
  });

  describe('constructor', () => {
    function test({ params, expected }) {
      let instance = new ArrayParser(params);
      nassert.assert(instance, expected, true);
    }

    it('should create an instance and set fields', () => {
      let params = getParams();
      let expected = {
        val: [1, 2, 3],
        name: 'clients',
        required: false,
        itemType: 'Int',
        ItemParser: IntParser
      };

      test({ params, expected });
    });

    it('should create an instance and set fields for custom itemType', () => {
      let itemHandler = () => {};
      let params = getParams({ itemType: 'Custom', itemHandler });
      let expected = {
        val: [1, 2, 3],
        name: 'clients',
        required: false,
        itemType: 'Custom',
        itemHandler,
        ItemParser: IntParser
      };

      test({ params, expected });
    });
  });

  describe('parse', () => {
    function test({ params, expected, areTestMethodsCalled }) {
      let instance = new ArrayParser(params);
      sinon.stub(instance, '_validateItemParser');
      sinon.stub(instance, '_parseItem').callsFake(val => val);
      sinon.stub(instance, '_validateAllowed');

      BaseParser.prototype.parse.returns(_.isNil(expected));

      let actual = instance.parse();
      should(actual).eql(expected);

      should(BaseParser.prototype.parse.calledOnce).equal(true);
      should(instance._validateItemParser.calledOnce).equal(areTestMethodsCalled);
      should(instance._parseItem.calledThrice).equal(areTestMethodsCalled);
      should(instance._validateAllowed.calledOnce).equal(areTestMethodsCalled);
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

    it('should call all related methods and return a parsed array', () => {
      test({
        params: getParams(),
        expected: [1, 2, 3],
        areTestMethodsCalled: true
      });
    });
  });

  describe('_validateItemParser', () => {
    registerTest({
      methodName: '_validateItemParser',
      testName: 'should throw error when ItemParser is undefined',
      params: getParams({ itemType: undefined }),
      expected: new Error('Invalid itemType')
    });

    registerTest({
      methodName: '_validateItemParser',
      testName: 'should throw error when ItemParser is null',
      params: getParams({ itemType: null }),
      expected: new Error('Invalid itemType')
    });

    registerTest({
      methodName: '_validateItemParser',
      testName: 'should not throw error when val is not nil',
      params: getParams()
    });
  });

  describe('_validateAllowed', () => {
    registerTest({
      methodName: '_validateAllowed',
      testName: 'should throw Error when allowed is defined and val is not subset of it',
      params: { name: 'login', val: ['u1'], allowed: ['u2', 'u3'], itemType: 'string' },
      expected: new Error('login is incorrect, must be subset of [u2,u3]')
    });

    registerTest({
      methodName: '_validateAllowed',
      testName: 'should not throw error when allowed is undefined',
      params: { name: 'login', val: ['u1'], allowed: undefined, itemType: 'string' }
    });

    registerTest({
      methodName: '_validateAllowed',
      testName: 'should not throw error when allowed is defined val is subset of it',
      params: { name: 'login', val: ['u1'], allowed: ['u1', 'u2', 'u3'], itemType: 'string' }
    });
  });

  describe('_parseItem', () => {
    function test({ parserParamsEx, params, expected, expectedIntParsersArgs, expectedCustomParsersArgs }) {
      let parserParams = getParams(parserParamsEx);
      let instance = new ArrayParser(parserParams);

      let actual = instance._parseItem(params);
      should(actual).eql(expected);

      nassert.validateCalledFn({ srvc: IntParser, fnName: 'parse', expectedArgs: expectedIntParsersArgs });
      nassert.validateCalledFn({ srvc: CustomParser, fnName: 'parse', expectedArgs: expectedCustomParsersArgs });
    }

    beforeEach(() => {
      sinon.stub(IntParser, 'parse').callsFake(params => params.val);
      sinon.stub(CustomParser, 'parse').callsFake(params => 'custom' + params.val);
    });

    afterEach(() => {
      IntParser.parse.restore();
      CustomParser.parse.restore();
    });

    it('should build params and return result of the parser.parse call', () => {
      let params = 1;
      let expected = 1;
      let expectedIntParsersArgs = {
        val: 1,
        name: 'item',
        required: true
      };

      test({ params, expected, expectedIntParsersArgs });
    });

    it('should build params and return result of the parser.parse call for custom parser', () => {
      let parserParamsEx = {
        itemType: 'Custom',
        itemHandler: (val) => val.toString()
      };
      let params = 1;
      let expected = 'custom1';
      let expectedCustomParsersArgs = {
        val: 1,
        name: 'item',
        handler: parserParamsEx.itemHandler,
        required: true
      };

      test({ parserParamsEx, params, expected, expectedCustomParsersArgs });
    });
  });
});
