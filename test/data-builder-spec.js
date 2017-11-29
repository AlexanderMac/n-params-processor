'use strict';

const should      = require('should');
const DataBuilder = require('../src/data-builder');

describe('data-builder', () => {
  let _instance;

  beforeEach(() => {
    _instance = new DataBuilder();
  });

  describe('constructor', () => {
    function test({ params, expected }) {
      let instance = new DataBuilder(params);
      should(instance.source).eql(expected.source);
      should(instance.data).eql(expected.data);
      should(instance.dest).equal(instance.data);
    }

    it('should init instance internal fields when baseData is not provided', () => {
      let params = {
        source: 'source'
      };
      let expected = {
        source: 'source',
        data: {}
      };
      test({ params, expected });
    });

    it('should init instance internal fields', () => {
      let params = {
        baseData: { id: 1 },
        source: 'source'
      };
      let expected = {
        source: 'source',
        data: { id: 1 }
      };
      test({ params, expected });
    });
  });

  describe('build', () => {
    function test(expected) {
      _instance.data = 'data';

      let actual = _instance.build();
      should(actual).eql(expected);
    }

    it('should return instance.data', () => {
      let expected = 'data';
      test(expected);
    });
  });
});
