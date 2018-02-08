'use strict';

const _            = require('lodash');
const consts       = require('./consts');
const QueryBuilder = require('./query-builder');

const MONGOOSE_OPS = consts.OPERATORS.MONGOOSE_OPS;

class MongooseQueryBuilder extends QueryBuilder {
  _buildFilter() {
    return _.reduce(this.data._filter_, (res, paramVal, paramName) => {
      let criterion = _.find(this.filterCriteria, { name: paramName });
      let dbSpecificOp = criterion ? MONGOOSE_OPS[criterion.op] : MONGOOSE_OPS.eq;
      res[paramName] = {
        [dbSpecificOp]: paramVal
      };
      return res;
    }, {});
  }

  _buildFields() {
    return _.join(this.data._fields_.fields, ' ');
  }

  _buildPagination() {
    return this.data._pagination_;
  }

  _buildSorting() {
    return this.data._sorting_;
  }
}

module.exports = MongooseQueryBuilder;
