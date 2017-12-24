'use strict';

const _      = require('lodash');
const should = require('should');

exports.registerTest = ({ Parser, methodName, testName, params, expected }) => {
  it(testName, () => {
    let instance = new Parser(params);
    if (expected instanceof Error) {
      should(() => instance[methodName]()).throw(expected);
    } else {
      instance[methodName]();
      if (!_.isNil(expected)) {
        should(instance.val).eql(expected);
      }
    }
  });
};
