'use strict';

const should     = require('should');
const MongooseQB = require('../src/mongoose-query-builder');

describe('mongoose-query-builder', () => {
  describe('_buildFilter', () => {
    function test({ instanceFilter, filterCriteria, expected }) {
      let instance = new MongooseQB();
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
      let instance = new MongooseQB();
      instance.data._fields_ = { fields: ['id', 'name'] };

      let actual = instance._buildFields();
      should(actual).eql(expected);
    }

    it('should build query fields', () => {
      let expected = 'id name';
      test(expected);
    });
  });

  describe('_buildPagination', () => {
    function test(expected) {
      let instance = new MongooseQB();
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
      let instance = new MongooseQB();
      instance.data._sorting_ = 'sortingData';

      let actual = instance._buildSorting();
      should(actual).eql(expected);
    }

    it('should build query sorting', () => {
      let expected = 'sortingData';
      test(expected);
    });
  });
});
