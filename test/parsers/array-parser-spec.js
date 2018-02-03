'use strict';

const _           = require('lodash');
const sinon       = require('sinon');
const should      = require('should');
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
      ItemParser: IntParser
    };
    return _.extend(def, ex);
  }

  describe('constructor', () => {
    function test({ params, expected }) {
      let instance = new ArrayParser(params);
      should(instance.val).equal(expected.val);
      should(instance.name).equal(expected.name);
      should(instance.items).equal(expected.items);
      should(instance.ItemParser).equal(expected.ItemParser);
    }

    it('should create an instance and set items, ItemParser', () => {
      let params = getParams();
      let expected = params;

      test({ params, expected });
    });
  });

  describe('parse', () => {
    function test({ params, expected, areTestMethodsCalled }) {
      let instance = new ArrayParser(params);
      sinon.stub(instance, '_validateItemParser');
      sinon.stub(instance, '_parseItem').callsFake(val => val);

      let actual = instance.parse();
      should(actual).eql(expected);

      should(BaseParser.prototype.parse.calledOnce).equal(true);
      should(instance._validateItemParser.calledOnce).equal(areTestMethodsCalled);
      should(instance._parseItem.calledThrice).equal(areTestMethodsCalled);
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
      params: getParams({ ItemParser: undefined }),
      expected: new Error('Invalid itemType')
    });

    registerTest({
      methodName: '_validateItemParser',
      testName: 'should throw error when ItemParser is null',
      params: getParams({ ItemParser: null }),
      expected: new Error('Invalid itemType')
    });

    registerTest({
      methodName: '_validateItemParser',
      testName: 'shouldn\'t throw error when val is not a nil',
      params: getParams()
    });
  });

  describe('_parseItem', () => {
    function test({ params, expected, expectedArgs }) {
      let instance = new ArrayParser(getParams());

      let actual = instance._parseItem(params);
      should(actual).eql(expected);

      should(IntParser.parse.calledOnce).equal(true);
      should(IntParser.parse.calledWith(expectedArgs)).equal(true);
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
