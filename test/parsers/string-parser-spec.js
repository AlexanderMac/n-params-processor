'use strict';

const _            = require('lodash');
const sinon        = require('sinon');
const should       = require('should');
const testUtil     = require('../test-util');
const BaseParser   = require('../../src/parsers/base-parser');
const StringParser = require('../../src/parsers/string-parser');

describe('parsers / string-parser', () => {
  function registerTest(params) {
    params.Parser = StringParser;
    testUtil.registerTest(params);
  }

  function getParams(ex) {
    let def = {
      val: 'user1',
      name: 'login'
    };
    return _.extend(def, ex);
  }

  describe('parse', () => {
    function test({ params, expected, areTestMethodsCalled }) {
      let instance = new StringParser(params);
      sinon.stub(instance, '_validateAllowed');
      sinon.stub(instance, '_validateMin');
      sinon.stub(instance, '_validateMax');

      BaseParser.prototype.parse.returns(_.isNil(expected));

      let actual = instance.parse();
      should(actual).eql(expected);

      should(BaseParser.prototype.parse.calledOnce).equal(true);
      should(instance._validateAllowed.calledOnce).equal(areTestMethodsCalled);
      should(instance._validateMin.calledOnce).equal(areTestMethodsCalled);
      should(instance._validateMax.calledOnce).equal(areTestMethodsCalled);
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

    it('should call all related methods and return an empty string when val is an empty string', () => {
      test({
        params: getParams({ val: '' }),
        expected: '',
        areTestMethodsCalled: true
      });
    });

    it('should call all related methods and return a result', () => {
      test({
        params: getParams(),
        expected: 'user1',
        areTestMethodsCalled: true
      });
    });
  });

  describe('_validateMin', () => {
    registerTest({
      methodName: '_validateMin',
      testName: 'should throw error when op.min is defined and provided val.length is less than min',
      params: getParams({ min: 7 }),
      expected: new Error('login must have at least 7 characters')
    });

    registerTest({
      methodName: '_validateMin',
      testName: 'shouldn\t throw error when op.min is defined and val.length is greater than min',
      params: getParams({ min: 1 })
    });

    registerTest({
      methodName: '_validateMin',
      testName: 'shouldn\t throw error when op.min is not defined',
      params: getParams()
    });
  });

  describe('_validateMax', () => {
    registerTest({
      methodName: '_validateMax',
      testName: 'should throw error when op.max is defined and provided val.length is greater than max',
      params: getParams({ max: 3 }),
      expected: new Error('login must have no more than 3 characters')
    });

    registerTest({
      methodName: '_validateMax',
      testName: 'shouldn\t throw error when op.max is defined and val.length is less than max',
      params: getParams({ max: 7 })
    });

    registerTest({
      methodName: '_validateMax',
      testName: 'shouldn\t throw error when op.max is not defined',
      params: getParams()
    });
  });
});
