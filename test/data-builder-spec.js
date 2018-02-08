'use strict';

const should      = require('should');
const DataBuilder = require('../src/data-builder');

describe('data-builder', () => {
  describe('build', () => {
    function test(expected) {
      let instance = new DataBuilder();
      instance.data = 'data';

      let actual = instance.build();
      should(actual).eql(expected);
    }

    it('should return instance.data', () => {
      let expected = 'data';
      test(expected);
    });
  });
});
