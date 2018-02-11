'use strict';

const _         = require('lodash');
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
