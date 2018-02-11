'use strict';

const _           = require('lodash');
const testUtil    = require('../../test-util');
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
