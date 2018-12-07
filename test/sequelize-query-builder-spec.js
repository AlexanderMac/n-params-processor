'use strict';

const should      = require('should');
const SequelizeQB = require('../src/sequelize-query-builder');

describe('sequelize-query-builder', () => {
  describe('_buildFilter', () => {
    function test({ instanceFilter, filterCriteria, expected }) {
      let instance = new SequelizeQB();
      instance.data._filter_ = instanceFilter;
      instance.filterCriteria = filterCriteria;

      let actual = instance._buildFilter();
      should(actual).eql(expected);
    }

    it('should build empty query filter when instance.data._filter_ is empty', () => {
      let instanceFilter = {};
      let expected = {};
      test({ instanceFilter, expected });
    });

    it('should build query filter', () => {
      let instanceFilter = {
        id: 1,
        name: 'u1'
      };
      let filterCriteria = [
        { name: 'id', 'op': 'ne' }
      ];
      let expected = {
        id: { $ne: 1 },
        name: 'u1',
      };

      test({ instanceFilter, filterCriteria, expected });
    });
  });

  describe('_buildFields', () => {
    function test(expected) {
      let instance = new SequelizeQB();
      instance.data._fields_ = { fields: ['id', 'name'] };

      let actual = instance._buildFields();
      should(actual).eql(expected);
    }

    it('should build query fields', () => {
      let expected = ['id', 'name'];
      test(expected);
    });
  });

  describe('_buildPagination', () => {
    function test(expected) {
      let instance = new SequelizeQB();
      instance.data._pagination_ = {
        page: 1,
        count: 10
      };

      let actual = instance._buildPagination();
      should(actual).eql(expected);
    }

    it('should build query pagination', () => {
      let expected = {
        page: 1,
        count: 10
      };
      test(expected);
    });
  });

  describe('_buildSorting', () => {
    function test({ _sorting_, expected }) {
      let instance = new SequelizeQB();
      instance.data._sorting_ = _sorting_;

      let actual = instance._buildSorting();
      should(actual).eql(expected);
    }

    it('should not build query sorting when data._sorting_ is null', () => {
      let expected = null;

      test({ expected });
    });

    it('should build query sorting when data._sorting is not null', () => {
      let _sorting_ = {
        by: 'createdAt',
        direction: 'desc'
      };
      let expected = [['createdAt', 'desc']];

      test({ _sorting_, expected });
    });
  });

  describe('integration tests', () => {
    function test({ req, expected }) {
      const ALLOWED_FIELDS = 'id firstName lastName age';
      const DEFAULT_FIELDS = 'id firstName lastName';
      let queryBuilder = new SequelizeQB({
        source: req.query
      });
      queryBuilder.parseString({ name: 'role', az: 'userRole', required: true });
      queryBuilder.parseArray({ name: 'users', az: 'userId', itemType: 'int', op: 'nin' });
      queryBuilder.parseFields({ allowed: ALLOWED_FIELDS, def: DEFAULT_FIELDS });
      queryBuilder.parsePagination();
      queryBuilder.parseSorting({ allowed: ['id', 'firstName'] });

      let actual = queryBuilder.build();
      should(actual).eql(expected);
    }

    it('should parse params and return query', () => {
      let req = {
        query: {
          role: 'user',
          users: [1, 2, 3],
          fields: 'firstName lastName',
          page: 5,
          count: 10,
          sortBy: 'firstName'
        }
      };
      let expected = {
        filter: {
          userRole: 'user',
          userId: { $notIn: [1, 2, 3] }
        },
        fields: ['firstName', 'lastName'],
        pagination: { page: 5, count: 10 },
        sorting: [['firstName', 'asc']]
      };

      test({ req, expected });
    });

    it('should parse params (when pagination, sorting and fields are empty) and return query', () => {
      let req = {
        query: {
          role: 'user',
          users: [1, 2, 3]
        }
      };
      let expected = {
        filter: {
          userRole: 'user',
          userId: { $notIn: [1, 2, 3] }
        },
        fields: ['id', 'firstName', 'lastName'],
        pagination: null,
        sorting: null
      };

      test({ req, expected });
    });
  });
});
