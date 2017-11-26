'use strict';

const _          = require('lodash');
const moment     = require('moment');
const validators = require('n-validators');

let _ErrorType = Error;

class ParamsProcessor {
  static registerErrorType(ErrorType) {
    _ErrorType = ErrorType;
  }

  getEmptyParams(filter) {
    return {
      filter: filter || {},
      fields: []
    };
  }

  getEmptyDataObject(data) {
    return data || {};
  }

  parseDataObject(opts, data) {
    let newData = _.pick(opts.from, opts.allowed);
    _.extend(data, newData);
  }

  parseString(opts, output) {
    this._testOptsAreValid(opts.from, opts.name);

    let val = opts.from[opts.name];

    this._testIsRequired(opts, val);

    if (!_.isNil(val)) {
      val = val.toString();
      if (opts.allowed && !_.includes(opts.allowed, val)) {
        this._throwUnprocessableRequestError(`${opts.name} has incorrect value`);
      }
      output[opts.name] = val;
    }
  }

  parseInt(opts, output) {
    this._testOptsAreValid(opts.from, opts.name);

    let val = opts.from[opts.name];

    this._testIsRequired(opts, val);

    if (!_.isNil(val)) {
      val = parseInt(val);
      this._testIsNumber(opts, val);
      this._testMin(opts, val);
      this._testMax(opts, val);
      output[opts.name] = val;
    }
  }

  parseFloat(opts, output) {
    this._testOptsAreValid(opts.from, opts.name);

    let val = opts.from[opts.name];

    this._testIsRequired(opts, val);

    if (!_.isNil(val)) {
      val = parseFloat(val);
      this._testIsNumber(opts, val);
      this._testMin(opts, val);
      this._testMax(opts, val);
      output[opts.name] = val;
    }
  }

  parseDate(opts, output) {
    this._testOptsAreValid(opts.from, opts.name);

    let val = opts.from[opts.name];

    this._testIsRequired(opts, val);

    if (!_.isNil(val)) {
      val = moment(val, moment.defaultFormat); // TODO: convert to date
      this._testIsDate(opts, val);
      output[opts.name] = val;
    }
  }

  parseId(opts, output) {
    opts.name = opts.name || 'id'; // TODO: don't use default param
    this._testOptsAreValid(opts.from, opts.name);

    let id = opts.from[opts.name];

    this._testIsRequired(opts, id);

    if (!_.isNil(id)) {
      id = parseInt(id);
      if (!validators.isId(id)) {
        this._throwUnprocessableRequestError(`${opts.name} must be a valid ID`);
      }
      output[opts.name] = id;
    }
  }

  parseIdList(opts, output) {
    this._testOptsAreValid(opts.from, opts.name);

    let ids = opts.from[opts.name];

    this._testIsRequired(opts, ids);

    if (!_.isNil(ids)) {
      if (!validators.everyIsUniqueId(ids)) {
        this._throwUnprocessableRequestError(`${opts.name} must be a valid list of IDs`);
      }
      output[opts.name] = ids;
    }
  }

  parseObjectId(opts, output) {
    opts.name = opts.name || 'id'; // TODO: don't use default param
    this._testOptsAreValid(opts.from, opts.name);

    let id = opts.from[opts.name];

    this._testIsRequired(opts, id);

    if (!_.isNil(id)) {
      if (!validators.isObjectId(id)) {
        this._throwUnprocessableRequestError(`${opts.name} must be a valid ObjectId`);
      }
      output[opts.name] = id;
    }
  }

  parseIn(opts, output) {
    opts.name = opts.name || 'in'; // TODO: don't use default param
    this._testOptsAreValid(opts.from, opts.name);

    let $in = opts.from[opts.name];

    this._testIsRequired(opts, $in);

    if (!_.isNil($in)) {
      $in = _.map($in, val => parseInt(val));
      if (!validators.everyIsUniqueId($in)) {
        this._throwUnprocessableRequestError('in must contain a list of valid IDs');
      }
      let field = opts.field || 'id';
      output[field] = output[field] || {};
      output[field].$in = $in;
    }
  }

  parseNin(opts, output) {
    opts.name = opts.name || 'nin'; // TODO: don't use default param
    this._testOptsAreValid(opts.from, opts.name);

    let $nin = opts.from[opts.name];

    this._testIsRequired(opts, $nin);

    if (!_.isNil($nin)) {
      $nin = _.map($nin, val => parseInt(val));
      if (!validators.everyIsUniqueId($nin)) {
        this._throwUnprocessableRequestError('nin must contain a list of valid IDs');
      }
      let field = opts.field || 'id';
      output[field] = output[field] || {};
      output[field].$notIn = $nin;
    }
  }

  parseFields(opts, output) {
    opts.name = 'fields'; // TODO: don't use default param
    this._testOptsAreValid(opts.from, opts.name);

    let fields = opts.from.fields || opts.def;

    if (!_.isNil(fields)) {
      if (!validators.isFieldsString(fields, opts.allowed)) {
        this._throwUnprocessableRequestError('fields must be a space separated string of fields');
      }
      output.fields = fields.split(' ');
    }
  }

  // TODO: test it
  _testOptsAreValid(from, name) {
    if (_.isNil(from)) {
      throw new Error('Impossible parse parameter. From is not provided');
    }
    if (_.isNil(name)) {
      throw new Error('Impossible parse parameter. Name is not provided');
    }
  }

  // TODO: test it
  _testIsRequired(opts, val) {
    if (opts.required && _.isNil(val)) {
      this._throwUnprocessableRequestError(`${opts.name} is required`);
    }
  }

  // TODO: test it
  _testIsNumber(opts, val) {
    if (isNaN(val)) {
      this._throwUnprocessableRequestError(`${opts.name} must be a number`);
    }
  }

  // TODO: test it
  _testIsDate(opts, val) {
    if (!moment(val).isValid()) {
      this._throwUnprocessableRequestError(`${opts.name} must be a date`);
    }
  }

  // TODO: test it
  _testMin(opts, val) {
    if (!_.isNil(opts.min) && val < opts.min) {
      this._throwUnprocessableRequestError(`${opts.name} must be greater than or equal to ${opts.min}`);
    }
  }

  // TODO: test it
  _testMax(opts, val) {
    if (!_.isNil(opts.max) && val > opts.max) {
      this._throwUnprocessableRequestError(`${opts.name} must be less than or equal to ${opts.max}`);
    }
  }

  // TODO: test it
  _throwUnprocessableRequestError(message) {
    throw new _ErrorType(message);
  }
}

module.exports = ParamsProcessor;
