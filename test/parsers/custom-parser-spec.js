const _ = require('lodash');
const sinon = require('sinon');
const should = require('should');
const nassert = require('n-assert');
const ParamsProcessorError = require('../../src/error');
const BaseParser = require('../../src/parsers/base-parser');
const CustomParser = require('../../src/parsers/custom-parser');

describe('parsers / custom-parser', () => {
  function getParams(ex) {
    let def = {
      val: 'custom Object',
      handler: () => 'parsed value'
    };
    return _.extend(def, ex);
  }

  describe('static getInstance', () => {
    function test() {
      let actual = CustomParser.getInstance({});
      should(actual).be.instanceof(CustomParser);
    }

    it('should create and return instance of CustomParser', () => {
      return test();
    });
  });

  describe('static parse', () => {
    beforeEach(() => {
      sinon.stub(CustomParser, 'getInstance');
    });

    afterEach(() => {
      CustomParser.getInstance.restore();
    });

    function test({ params, expected }) {
      let mock = {
        parse: () => 'ok'
      };
      sinon.spy(mock, 'parse');
      CustomParser.getInstance.returns(mock);

      let actual = CustomParser.parse(params);
      nassert.assert(actual, expected);

      nassert.assertFn({ inst: CustomParser, fnName: 'getInstance', expectedArgs: params });
      nassert.assertFn({ inst: mock, fnName: 'parse', expectedArgs: '_without-args_' });
    }

    it('should create instance of CustomParser, call parse method and return result', () => {
      let params = 'params';
      let expected = 'ok';

      return test({ params, expected });
    });
  });

  describe('parse', () => {
    function test({ params, expected }) {
      let instance = new CustomParser(params);

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

    it('should call handler and return a value when handler is a valid function', () => {
      test({
        params: getParams(),
        expected: 'parsed value'
      });
    });

    it('should throw Error when handler is not a valid function', () => {
      test({
        params: getParams({ handler: undefined }),
        expected: new ParamsProcessorError('handler must be a function')
      });
    });
  });
});
