'use strict';

const _          = require('lodash');
const sinon      = require('sinon');
const should     = require('should');
const BaseParser = require('../../src/parsers/base-parser');
const JsonParser = require('../../src/parsers/json-parser');

describe('parsers / json-parser', () => {
  function getParams(ex) {
    let def = {
      val: '{ "name": "John" }',
      name: 'user'
    };
    return _.extend(def, ex);
  }

  describe('parse', () => {
    function test({ params, expected }) {
      let instance = new JsonParser(params);

      BaseParser.prototype.parse.returns(_.isNil(expected));

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

    it('should return true when val is a valid JSON string', () => {
      test({
        params: getParams(),
        expected: { name: 'John' }
      });
    });

    it('should throw Error when val is an invalid JSON string', () => {
      test({
        params: getParams({ val: 'invalid json' }),
        expected: new Error('user must be a valid JSON string')
      });
    });
  });
});
