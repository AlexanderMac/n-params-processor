'use strict';

const _          = require('lodash');
const moment     = require('moment');
const sinon      = require('sinon');
const should     = require('should');
const ParamsProc = require('../src/params-processor');
const parsers    = require('../src/parsers');

describe('params-processor', () => {
  let _instance;

  function registerParseTest({ parseFnName, parserName, exParams, exParamsOmit, exParseArgs, exParseArgsOmit }) {
    it('should call related methods', () => {
      let params = _
        .chain({
          source: 'src',
          name: 'name1',
          outName: 'name2',
          min: 'min',
          max: 'max',
          allowed: ['val1', 'val2'],
          required: true
        })
        .extend(exParams)
        .omit(exParamsOmit)
        .value();

      let expectedDest = {
        name2: 'parsed value'
      };
      let expectedGetValueArgs = {
        source: 'src',
        name: 'name1'
      };
      let expectedParseArgs = _
        .chain({
          val: 'intial value',
          name: 'name1',
          min: 'min',
          max: 'max',
          allowed: ['val1', 'val2'],
          required: true
        })
        .extend(exParseArgs)
        .omit(exParseArgsOmit)
        .value();

      _instance._getValue.callsFake(() => 'intial value');
      parsers[parserName].parse.callsFake(() => 'parsed value');

      _instance[parseFnName](params);
      should(_instance.dest).eql(expectedDest);

      should(_instance._getValue.calledOnce).equal(true);
      should(_instance._getValue.calledWith(expectedGetValueArgs)).equal(true);
      should(parsers[parserName].parse.calledOnce).equal(true);
      should(parsers[parserName].parse.calledWith(expectedParseArgs)).equal(true);
    });
  }

  beforeEach(() => {
    _instance = new ParamsProc();
    _instance.dest = {};
  });

  describe('parseString', () => {
    beforeEach(() => {
      sinon.stub(_instance, '_getValue');
      sinon.stub(parsers.StringParser, 'parse');
    });

    afterEach(() => {
      _instance._getValue.restore();
      parsers.StringParser.parse.restore();
    });

    registerParseTest({ parseFnName: 'parseString', parserName: 'StringParser' });
  });

  describe('parseInt', () => {
    beforeEach(() => {
      sinon.stub(_instance, '_getValue');
      sinon.stub(parsers.IntParser, 'parse');
    });

    afterEach(() => {
      _instance._getValue.restore();
      parsers.IntParser.parse.restore();
    });

    registerParseTest({ parseFnName: 'parseInt', parserName: 'IntParser' });
  });

  describe('parseFloat', () => {
    beforeEach(() => {
      sinon.stub(_instance, '_getValue');
      sinon.stub(parsers.FloatParser, 'parse');
    });

    afterEach(() => {
      _instance._getValue.restore();
      parsers.FloatParser.parse.restore();
    });

    registerParseTest({ parseFnName: 'parseFloat', parserName: 'FloatParser' });
  });

  describe('parseId', () => {
    beforeEach(() => {
      sinon.stub(_instance, '_getValue');
      sinon.stub(parsers.IdParser, 'parse');
    });

    afterEach(() => {
      _instance._getValue.restore();
      parsers.IdParser.parse.restore();
    });

    registerParseTest({ parseFnName: 'parseId', parserName: 'IdParser' });
  });

  describe('parseDate', () => {
    beforeEach(() => {
      sinon.stub(_instance, '_getValue');
      sinon.stub(parsers.DateParser, 'parse');
    });

    afterEach(() => {
      _instance._getValue.restore();
      parsers.DateParser.parse.restore();
    });

    registerParseTest({
      parseFnName: 'parseDate',
      parserName: 'DateParser',
      exParams: { format: moment.defaultFormat },
      exParseArgs: { format: moment.defaultFormat },
      exParseArgsOmit: 'allowed'
    });
  });

  describe('parseJson', () => {
    beforeEach(() => {
      sinon.stub(_instance, '_getValue');
      sinon.stub(parsers.JsonParser, 'parse');
    });

    afterEach(() => {
      _instance._getValue.restore();
      parsers.JsonParser.parse.restore();
    });

    registerParseTest({
      parseFnName: 'parseJson',
      parserName: 'JsonParser',
      exParseArgsOmit: ['min', 'max', 'allowed']
    });
  });

  describe('parseBool', () => {
    beforeEach(() => {
      sinon.stub(_instance, '_getValue');
      sinon.stub(parsers.BoolParser, 'parse');
    });

    afterEach(() => {
      _instance._getValue.restore();
      parsers.BoolParser.parse.restore();
    });

    registerParseTest({
      parseFnName: 'parseBool',
      parserName: 'BoolParser',
      exParseArgsOmit: ['min', 'max', 'allowed']
    });
  });

  describe('parseObjectId', () => {
    beforeEach(() => {
      sinon.stub(_instance, '_getValue');
      sinon.stub(parsers.ObjectIdParser, 'parse');
    });

    afterEach(() => {
      _instance._getValue.restore();
      parsers.ObjectIdParser.parse.restore();
    });

    registerParseTest({
      parseFnName: 'parseObjectId',
      parserName: 'ObjectIdParser',
      exParseArgsOmit: ['allowed', 'min', 'max']
    });
  });

  describe('parseArray', () => {
    beforeEach(() => {
      sinon.stub(_instance, '_getValue');
      sinon.stub(parsers.ArrayParser, 'parse');
    });

    afterEach(() => {
      _instance._getValue.restore();
      parsers.ArrayParser.parse.restore();
    });

    registerParseTest({
      parseFnName: 'parseArray',
      parserName: 'ArrayParser',
      exParams: { items: [1, 2, 3], itemType: 'Int' },
      exParseArgs: { items: [1, 2, 3], ItemParser: parsers.IntParser },
      exParseArgsOmit: ['min', 'max', 'allowed']
    });
  });

  describe('_getValue', () => {
    function test({ params, instanceSource, expected }) {
      _instance.source = instanceSource;
      let actual = _instance._getValue(params);
      should(actual).eql(expected);
    }

    it('should use instance.source when source parameter is undefined', () => {
      test({
        params: { source: undefined, name: 'login' },
        instanceSource: { login: 'u2' },
        expected: 'u2'
      });
    });

    it('should use source parameter when it\'s undefined', () => {
      test({
        params: { source: { login: 'u1' }, name: 'login' },
        instanceSource: { login: 'u2' },
        expected: 'u1'
      });
    });
  });
});
