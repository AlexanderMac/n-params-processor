'use strict';

const _           = require('lodash');
const sinon       = require('sinon');
const should      = require('should');
const nassert     = require('n-assert');
const testUtil    = require('../test-util');
const BaseParser  = require('../../src/parsers/base-parser');
const IntParser   = require('../../src/parsers/number-parsers/int-parser');
const ArrayParser = require('../../src/parsers/array-parser');

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
      testName: 'shouldn\'t throw error when val is not nil',
      params: getParams()
    });
  });

  describe('_validateAllowed', () => {
    registerTest({
      methodName: '_validateAllowed',
      testName: 'should throw Error when allowed is defined and val is not subset of it',
      params: { name: 'login', val: ['u1'], allowed: ['u2', 'u3'], itemType: 'string' },
      expected: new Error('login is incorrect, must be subset of u2,u3')
    });

    registerTest({
      methodName: '_validateAllowed',
      testName: 'shouldn\'t throw error when allowed is undefined',
      params: { name: 'login', val: ['u1'], allowed: undefined, itemType: 'string' }
    });

    registerTest({
      methodName: '_validateAllowed',
      testName: 'shouldn\'t throw error when allowed is defined val is subset of it',
      params: { name: 'login', val: ['u1'], allowed: ['u1', 'u2', 'u3'], itemType: 'string' }
    });
  });

  describe('_parseItem', () => {
    function test({ params, expected, expectedArgs }) {
      let instance = new ArrayParser(getParams());

      let actual = instance._parseItem(params);
      should(actual).eql(expected);

      nassert.validateCalledFn({ srvc: IntParser, fnName: 'parse', expectedArgs });
    }

    beforeEach(() => {
      sinon.stub(IntParser, 'parse').callsFake(params => params.val);
    });

    afterEach(() => {
      IntParser.parse.restore();
    });

    it('should build params and return result of the parser.parse call', () => {
      let params = 1;
      let expected = 1;
      let expectedArgs = {
        val: 1,
        name: 'item',
        required: true
      };

      test({ params, expected, expectedArgs });
    });
  });
});
