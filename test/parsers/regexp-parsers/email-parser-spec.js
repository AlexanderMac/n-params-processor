'use strict';

const sinon       = require('sinon');
const should      = require('should');
const nassert     = require('n-assert');
const EmailParser = require('../../../src/parsers/regexp-parsers/email-parser');

describe('parsers / regexp-parsers / email-parser', () => {
  describe('static getInstance', () => {
    function test() {
      let actual = EmailParser.getInstance({});
      should(actual).be.instanceof(EmailParser);
    }

    it('should create and return instance of EmailParser', () => {
      return test();
    });
  });

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(EmailParser, 'getInstance');
    });

    afterEach(() => {
      EmailParser.getInstance.restore();
    });

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      };
      sinon.spy(mock, 'parse');
      EmailParser.getInstance.returns(mock);

      let actual = EmailParser.parse(params);
      nassert.assert(actual, expected);

      nassert.assertFn({ inst: EmailParser, fnName: 'getInstance', expectedArgs: params });
      nassert.assertFn({ inst: mock, fnName: 'parse', expectedArgs: '_without-args_' });
    }

    it('should create instance of EmailParser, call parse method and return result', () => {
      let params = 'params';
      let expected = 'ok';

      return test({ params, expected });
    });
  });

  describe('_getRegexp', () => {
    it('should return ObjectId regexp', () => {
      let instance = new EmailParser({});

      let expected = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
      let actual = instance._getRegexp();
      should(actual).eql(expected);
    });
  });
});
