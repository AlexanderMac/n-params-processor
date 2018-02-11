'use strict';

const _        = require('lodash');
const should   = require('should');
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
