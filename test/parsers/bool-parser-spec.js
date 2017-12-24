'use strict';

const _          = require('lodash');
const sinon      = require('sinon');
const should     = require('should');
const BaseParser = require('../../src/parsers/base-parser');
const BoolParser = require('../../src/parsers/bool-parser');

describe('parsers / bool-parser', () => {
  function getParams(ex) {
    let def = {
      val: 'true',
      name: 'success'
    };
    return _.extend(def, ex);
  }

  describe('parse', () => {
    function test({ params, expected }) {
      let instance = new BoolParser(params);

      if (expected instanceof Error) {
        should(() => instance.parse()).throw(expected);
      } else {
        let actual = instance.parse();
        should(actual).eql(expected);
      }

      should(BaseParser.prototype.parse.calledOnce).equal(true);
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
        expected: undefined
      });
    });

    it('should call base.parse only and return null when val is null', () => {
      test({
        params: getParams({ val: null }),
        expected: null
      });
    });

    it('should return true when val is true', () => {
      test({
        params: getParams({ val: true }),
        expected: true
      });
    });

    it('should return false when val is false', () => {
      test({
        params: getParams({ val: false }),
        expected: false
      });
    });

    it('should return true when val is `true` string', () => {
      test({
        params: getParams({ val: 'true' }),
        expected: true
      });
    });

    it('should return false when val is `false` string', () => {
      test({
        params: getParams({ val: 'false' }),
        expected: false
      });
    });

    it('should throw Error when val is an invalid boolean', () => {
      test({
        params: getParams({ val: 'invalid bool' }),
        expected: new Error('success must be a valid boolean value')
      });
    });
  });
});
