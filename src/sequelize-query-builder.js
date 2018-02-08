'use strict';

const _            = require('lodash');
const consts       = require('./consts');
const QueryBuilder = require('./query-builder');

const SEQUELIZE_OPS = consts.OPERATORS.SEQUELIZE_OPS;

class SequelizeQueryBuilder extends QueryBuilder {
  _buildFilter() {
    return _.reduce(this.data._filter_, (res, paramVal, paramName) => {
      let criterion = _.find(this.filterCriteria, { name: paramName });
      let dbSpecificOp = criterion ? SEQUELIZE_OPS[criterion.op] : SEQUELIZE_OPS.eq;
      res[paramName] = {
        [dbSpecificOp]: paramVal
      };
      return res;
    }, {});
  }

  _buildFields() {
    return this.data._fields_.fields;
  }

  _buildPagination() {
    return this.data._pagination_;
  }

  _buildSorting() {
    return this.data._sorting_;
  }
}

module.exports = SequelizeQueryBuilder;
