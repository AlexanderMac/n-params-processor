'use strict';

const _          = require('lodash');
const validators = require('n-validators');
const consts     = require('./consts');
const ParamsProc = require('./params-processor');

class QueryBuilder extends ParamsProc {
  constructor({ baseFilter, source } = {}) {
    let filter = baseFilter || {};
    super({ source, dest: filter });
    this.filter = filter;
    this.fields = '';
    /* TODO: not implemented
    this.pagination = {
      page: 1,
      count: 10
    };
    this.sorting = {};
    */
  }

  parseIn(opts) {
    opts = _.chain(opts).clone().extend({ expr: '$$in' }).value();
    this._parseInNotInExpression(opts);
  }

  parseNin(opts) {
    opts = _.chain(opts).clone().extend({ expr: '$$nin' }).value();
    this._parseInNotInExpression(opts);
  }

  _parseInNotInExpression({ source, name, field, expr, required }) {
    let val = this._validateParamsAndGetValue({ source, name, required });
    if (_.isNil(val)) {
      return;
    }
    this._testParameterIsProvided({ param: field, paramName: 'field' });

    val = _.map(val, item => parseInt(item));
    if (!validators.everyIsUniqueId(val)) {
      this._throwUnprocessableRequestError(`${name} must contain a list of valid IDs`);
    }
    this.dest[expr] = {
      fieldName: field,
      fieldVal: val
    };
  }

  parseFields({ source, name, allowed, def, required }) {
    let val = this._validateParamsAndGetValue({ source, name, required });
    if (_.isNil(val)) {
      this.fields = def || '';
      return;
    }

    if (!validators.isFieldsString(val, allowed)) {
      this._throwUnprocessableRequestError('fields must be a space separated string of fields');
    }
    this.fields = val;
  }

  /* TODO: not implemented
  // TODO: test it
  // TODO: implement it
  parsePagination() {
  }

  // TODO: test it
  // TODO: implement it
  parseSorting() {
  }
  */

  build(dbProvider) {
    switch (dbProvider) {
      case consts.DB_PROVIDERS.mongoose:
        return this._buildMongooseQuery();
      case consts.DB_PROVIDERS.sequelize:
        return this._buildSequelizeQuery();
      default:
        if (!dbProvider) {
          throw Error('dbProvider is not defined');
        }
        throw Error(`Unsupported dbPovider: ${dbProvider}`);
    }
  }

  _buildMongooseQuery() {
    let filter = _.reduce(this.filter, (res, paramVal, paramName) => {
      switch (paramName) {
        case '$$in':
          res[paramVal.fieldName] = {
            $in: paramVal.fieldVal
          };
          break;
        case '$$nin':
          res[paramVal.fieldName] = {
            $nin: paramVal.fieldVal
          };
          break;
        default:
          res[paramName] = paramVal;
      }
      return res;
    }, {});

    let fields = this.fields;

    return {
      filter,
      fields,
      /* TODO: not implemented
      pagination: this.pagination,
      sorting: this.sorting
      */
    };
  }

  _buildSequelizeQuery() {
    let filter = _.reduce(this.filter, (res, paramVal, paramName) => {
      switch (paramName) {
        case '$$in':
          res[paramVal.fieldName] = {
            $in: paramVal.fieldVal
          };
          break;
        case '$$nin':
          res[paramVal.fieldName] = {
            $notIn: paramVal.fieldVal
          };
          break;
        default:
          res[paramName] = paramVal;
      }
      return res;
    }, {});

    let fields = this.fields.split(' ');

    return {
      filter,
      fields,
      /* TODO: not implemented
      pagination: this.pagination,
      sorting: this.sorting
      */
    };
  }
}

module.exports = QueryBuilder;
