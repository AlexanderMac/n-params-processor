'use strict';

const sinon          = require('sinon');
const should         = require('should');
const nassert        = require('n-assert');
const ObjectIdParser = require('../../../src/parsers/regexp-parsers/objectid-parser');

describe('parsers / regexp-parsers / objectid-parser', () => {
  describe('static getInstance', () => {
    function test() {
      let actual = ObjectIdParser.getInstance({});
      should(actual).be.instanceof(ObjectIdParser);
    }

    it('should create and return instance of ObjectIdParser', () => {
      return test();
    });
  });

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(ObjectIdParser, 'getInstance');
    });

    afterEach(() => {
      ObjectIdParser.getInstance.restore();
    });

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      };
      sinon.spy(mock, 'parse');
      ObjectIdParser.getInstance.returns(mock);

      let actual = ObjectIdParser.parse(params);
      nassert.assert(actual, expected);

      nassert.validateCalledFn({ srvc: ObjectIdParser, fnName: 'getInstance', expectedArgs: params });
      nassert.validateCalledFn({ srvc: mock, fnName: 'parse', expectedArgs: '_without-args_' });
    }

    it('should create instance of ObjectIdParser, call parse method and return result', () => {
      let params = 'params';
      let expected = 'ok';

      return test({ params, expected });
    });
  });

  describe('_getRegexp', () => {
    it('should return ObjectId regexp', () => {
      let instance = new ObjectIdParser({});

      let expected = /^[0-9a-fA-F]{24}$/;
      let actual = instance._getRegexp();
      should(actual).eql(expected);
    });
  });
});
