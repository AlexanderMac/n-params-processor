'use strict';

const _            = require('lodash');
const sinon        = require('sinon');
const should       = require('should');
const nassert      = require('n-assert');
const BaseBuilder  = require('../src/base-builder');
const QueryBuilder = require('../src/query-builder');

describe('query-builder', () => {
  describe('constructor', () => {
    function test({ params, expected }) {
      let instance = new QueryBuilder(params);
      should(instance.source).eql(expected.source);
      should(instance.data).eql(expected.data);
      should(instance.filterCriteria).eql(expected.filterCriteria);
    }

    it('should init instance internal fields when filter is not provided', () => {
      let params = {
        source: 'source'
      };
      let expected = {
        source: 'source',
        data: {
          _filter_: {},
          _fields_: {},
          _pagination_: {},
          _sorting_: {},
          _temp_: {},
        },
        filterCriteria: []
      };
      test({ params, expected });
    });

    it('should init instance internal fields when filter is provided', () => {
      let params = {
        filter: { id: 1 }
      };
      let expected = {
        data: {
          _filter_: { id: 1 },
          _fields_: {},
          _pagination_: {},
          _sorting_: {},
          _temp_: {},
        },
        filterCriteria: []
      };
      test({ params, expected });
    });
  });

  describe('parseFields', () => {
    function test({ params, parseStringArgs, parseArrayArgs, parseStringRes, expected }) {
      let instance = new QueryBuilder();
      instance.data._fields_ = 'fieldsData';
      sinon.stub(instance, 'parseString').returns(parseStringRes);
      sinon.stub(instance, 'parseArray');

      let actual = instance.parseFields(params);
      should(actual).eql(expected);
      should(instance.data._fields_).eql(expected);

      nassert.validateCalledFn({ srvc: instance, fnName: 'parseString', expectedArgs: parseStringArgs });
      nassert.validateCalledFn({ srvc: instance, fnName: 'parseArray', expectedArgs: parseArrayArgs });
    }

    it('should return instance.data._fields_ and use default names when params.source, fieldsName are undefined', () => {
      let params = {
        allowed: 'id name email',
        def: 'id'
      };
      let expected = 'fieldsData';
      let allowed = params.allowed.split(' ');
      let parseStringArgs = { source: undefined, name: 'fields', az: 'fields', to: '_temp_', def: params.def };
      let parseArrayArgs = { source: { fields: ['id'] }, name: 'fields', to: '_fields_', allowed, itemType: 'string' };
      let parseStringRes = { val: 'id' };

      test({ params, parseStringArgs, parseArrayArgs, parseStringRes, expected  });
    });

    it('should return instance.data._fields_ and use provided values when params.source, fieldsName are defined', () => {
      let params = {
        source: {
          attrs: 'id name'
        },
        fieldsName: 'attrs',
        allowed: 'id name email',
        def: 'id'
      };
      let expected = 'fieldsData';
      let allowed = params.allowed.split(' ');
      let parseStringArgs = { source: undefined, name: 'attrs', az: 'fields', to: '_temp_', def: params.def };
      let parseArrayArgs = { source: { fields: ['id', 'name'] }, name: 'fields', to: '_fields_', allowed, itemType: 'string' };
      let parseStringRes = { val: 'id name' };

      test({ params, parseStringArgs, parseArrayArgs, parseStringRes, expected  });
    });
  });

  describe('parsePagination', () => {
    function test({ params, parseIntFirstCallArgs, parseIntScndCallArgs, expected }) {
      let instance = new QueryBuilder();
      instance.data._pagination_ = 'paginationData';
      sinon.stub(instance, 'parseInt');

      let actual = instance.parsePagination(params);
      should(actual).eql(expected);
      should(instance.data._pagination_).eql(expected);

      should(instance.parseInt.calledTwice).equal(true);
      should(instance.parseInt.firstCall.calledWithExactly(parseIntFirstCallArgs)).equal(true);
      should(instance.parseInt.secondCall.calledWithExactly(parseIntScndCallArgs)).equal(true);
    }

    it('should return instance.data._pagination_ and use default names when params.source, pageName, countName are undefined', () => {
      let params = {};
      let expected = 'paginationData';
      let to = '_pagination_';
      let parseIntFirstCallArgs = { source: undefined, name: 'page', az: 'page', to, min: 0, def: 0 };
      let parseIntScndCallArgs = { source: undefined, name: 'count', az: 'count', to, min: 1, max: 50, def: 10 };

      test({ params, expected, parseIntFirstCallArgs, parseIntScndCallArgs });
    });

    it('should return instance.data._pagination_ and use provided values when params.source, pageName, countName are defined', () => {
      let params = {
        source: 'source',
        pageName: 'nPage',
        countName: 'cnt'
      };
      let expected = 'paginationData';
      let to = '_pagination_';
      let parseIntFirstCallArgs = { source: 'source', name: 'nPage', az: 'page', to, min: 0, def: 0 };
      let parseIntScndCallArgs = { source: 'source', name: 'cnt', az: 'count', to, min: 1, max: 50, def: 10 };

      test({ params, expected, parseIntFirstCallArgs, parseIntScndCallArgs });
    });
  });

  describe('parseSorting', () => {
    function test({ params, parseStringFirstCallArgs, parseStringScndCallArgs, expected }) {
      let instance = new QueryBuilder();
      instance.data._sorting_ = 'sortingData';
      sinon.stub(instance, 'parseString');

      let actual = instance.parseSorting(params);
      should(actual).eql(expected);
      should(instance.data._sorting_).eql(expected);

      should(instance.parseString.calledTwice).equal(true);
      should(instance.parseString.firstCall.calledWithExactly(parseStringFirstCallArgs)).equal(true);
      should(instance.parseString.secondCall.calledWithExactly(parseStringScndCallArgs)).equal(true);
    }

    it('should return instance.data._sorting_ and use default names when params.source, sortByName, sortDirName are undefined', () => {
      let params = {};
      let expected = 'sortingData';
      let to = '_sorting_';
      let parseStringFirstCallArgs = { source: undefined, name: 'sortBy', az: 'sortBy', to, def: 'id' };
      let parseStringScndCallArgs = { source: undefined, name: 'sortDirection', az: 'sortDirection', to, allowed: ['asc', 'desc'], def: 'asc' };

      test({ params, expected, parseStringFirstCallArgs, parseStringScndCallArgs });
    });

    it('should return instance.data._sorting_ and use provided values when params.source, sortByName, sortDirName are defined', () => {
      let params = {
        source: 'source',
        sortByName: 'orderBy',
        sortDirName: 'sortDir'
      };
      let expected = 'sortingData';
      let to = '_sorting_';
      let parseStringFirstCallArgs = { source: 'source', name: 'orderBy', az: 'sortBy', to, def: 'id' };
      let parseStringScndCallArgs = { source: 'source', name: 'sortDir', az: 'sortDirection', to, allowed: ['asc', 'desc'], def: 'asc' };

      test({ params, expected, parseStringFirstCallArgs, parseStringScndCallArgs });
    });
  });

  describe('build', () => {
    function test(expected) {
      let instance = new QueryBuilder();
      instance._buildFilter = () => 'builtFilter';
      instance._buildFields = () => 'builtFields';
      instance._buildPagination = () => 'builtPagination';
      instance._buildSorting = () => 'builtSorting';

      let actual = instance.build();
      should(actual).eql(expected);
    }

    it('should call related methods and return result', () => {
      let expected = {
        filter: 'builtFilter',
        fields: 'builtFields',
        pagination: 'builtPagination',
        sorting: 'builtSorting'
      };

      test(expected);
    });
  });

  describe('_registerOneParseFunction', () => {
    let instance;

    beforeEach(() => {
      instance = new QueryBuilder();
      sinon.stub(BaseBuilder.prototype, '_registerOneParseFunction').callsFake(() => {
        instance.parseSuper = () => {};
        return 'parseSuper';
      });
    });

    afterEach(() => {
      BaseBuilder.prototype._registerOneParseFunction.restore();
    });

    function test({ parserName, expected }) {
      let actual = instance._registerOneParseFunction(parserName);
      should(actual).eql(expected);
      should(_.isFunction(instance.parseSuper)).equal(true);
    }

    it('should add new parse<parserName> instance.method and return parse<parser> function name', () => {
      let parserName = 'SuperParser';
      let expected = 'parseSuper';

      test({ parserName, expected });
    });
  });

  describe('parseString', () => {
    function test({ params, expected }) {
      let instance = new QueryBuilder();

      let actual = instance.parseString(params);
      should(actual).eql(expected.result);
      should(instance.filterCriteria).eql(expected.filterCriteria);
    }

    it('should call registered parser, update filter and return value (when params.to is undefined)', () => {
      let params = {
        source: { login: 'u1' },
        name: 'login'
      };
      let parseSuperArgs = {
        params: 'params',
        to: '_filter_'
      };
      let expected = {
        result: {
          name: 'login',
          val: 'u1'
        },
        filterCriteria: [
          { name: 'login', op: undefined }
        ]
      };

      test({ params, parseSuperArgs, expected });
    });

    it('should call registered parser, update pagination and return value (when params.to = _pagination_)', () => {
      let params = {
        source: { page: 2 },
        name: 'page',
        to: '_pagination_'
      };
      let parseSuperArgs = {
        params: 'params',
        to: '_pagination_'
      };
      let expected = {
        result: {
          name: 'page',
          val: '2'
        },
        filterCriteria: []
      };

      test({ params, parseSuperArgs, expected });
    });
  });
});
