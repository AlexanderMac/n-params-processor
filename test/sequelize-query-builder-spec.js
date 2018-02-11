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
        name: { $eq: 'u1' },
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
      instance.data._pagination_ = 'paginationData';

      let actual = instance._buildPagination();
      should(actual).eql(expected);
    }

    it('should build query pagination', () => {
      let expected = 'paginationData';
      test(expected);
    });
  });

  describe('_buildSorting', () => {
    function test(expected) {
      let instance = new SequelizeQB();
      instance.data._sorting_ = 'sortingData';

      let actual = instance._buildSorting();
      should(actual).eql(expected);
    }

    it('should build query sorting', () => {
      let expected = 'sortingData';
      test(expected);
    });
  });

  describe('functional', () => {
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
      queryBuilder.parseSorting();

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
          userRole: { $eq: 'user' },
          userId: { $notIn: [1, 2, 3] }
        },
        fields: ['firstName', 'lastName'],
        pagination: { page: 5, count: 10 },
        sorting: { sortBy: 'firstName', sortDirection: 'asc' }
      };

      test({ req, expected });
    });
  });
});
