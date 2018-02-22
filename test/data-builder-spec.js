'use strict';

const should      = require('should');
const DataBuilder = require('../src/data-builder');

describe('data-builder', () => {
  describe('build', () => {
    function test(expected) {
      let instance = new DataBuilder();
      instance.data.userId = 11;

      let actual = instance.build();
      should(actual).eql(expected);
    }

    it('should return instance.data', () => {
      let expected = {
        userId: 11
      };
      test(expected);
    });
  });

  describe('integration tests', () => {
    function test({ req, expected }) {
      let dataBuilder = new DataBuilder({
        source: req.body,
        data: { creator: req.user.userId }
      });
      dataBuilder.parseString({ name: 'firstName', max: 10, required: true });
      dataBuilder.parseString({ name: 'lastName', max: 20, def: 'not prodived' });
      dataBuilder.parseInt({ name: 'age', min: 18, max: 55, required: true });
      dataBuilder.parseArray({ name: 'roles', allowed: ['user', 'admin', 'owner'], itemType: 'string' });

      let actual = dataBuilder.build();
      should(actual).eql(expected);
    }

    it('should return parse params and return data', () => {
      let req = {
        body: {
          firstName: 'John',
          age: '25',
          roles: ['user']
        },
        user: { userId: '58ea5b07973ab04f88def3fa' }
      };
      let expected = {
        creator: '58ea5b07973ab04f88def3fa',
        firstName: 'John',
        lastName: 'not prodived',
        age: 25,
        roles: ['user']
      };

      test({ req, expected });
    });
  });
});
