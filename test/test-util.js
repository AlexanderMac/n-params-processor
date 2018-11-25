'use strict';

const _       = require('lodash');
const should  = require('should');
const sinon   = require('sinon');
const nassert = require('n-assert');

nassert.initSinon(sinon);

exports.registerTest = ({ Parser, methodName, testName, params, expected, expectedRes }) => {
  it(testName, () => {
    let instance = new Parser(params);
    if (expected instanceof Error) {
      should(() => instance[methodName]()).throw(expected);
    } else {
      let res = instance[methodName]();
      if (!_.isUndefined(expectedRes)) {
        should(res).eql(expectedRes);
      }
      if (!_.isUndefined(expected)) {
        should(instance.val).eql(expected);
      }
    }
  });
};
