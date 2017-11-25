'use strict';

const _           = require('lodash');
const moment      = require('moment');
const validations = require('./validations');

let _CustomErrorType = Error;

// TODO: test it
exports.registerCustomErrorType = (CustomErrorType) => {
  _CustomErrorType = CustomErrorType;
};

// TODO: test it
exports.getEmptyParams = (filter) => {
  return {
    filter: filter || {},
    fields: []
  };
};

// TODO: test it
exports.getEmptyObjectData = (data) => {
  return data || {};
};

// TODO: test it
exports.parseObjectData = (opts, data) => {
  let newData = _.pick(opts.from, opts.allowed);
  _.extend(data, newData);
};

// TODO: test it
exports.processStringParam = (opts, output) => {
  let val = opts.from[opts.name];

  _testIsRequired(opts, val);

  if (!_.isNil(val)) {
    if (opts.allowed && !_.includes(opts.allowed, val)) {
      _throwUnprocessableRequestError(`${opts.name} has incorrect value`);
    }
    output[opts.name] = val;
  }
};

// TODO: test it
exports.processIntParam = (opts, output) => {
  let val = opts.from[opts.name];

  _testIsRequired(opts, val);

  if (!_.isNil(val)) {
    val = parseInt(val);
    _testIsNumber(opts, val);
    _testMin(opts, val);
    _testMax(opts, val);
    output[opts.name] = val;
  }
};

// TODO: test it
exports.processFloatParam = (opts, output) => {
  let val = opts.from[opts.name];

  _testIsRequired(opts, val);

  if (!_.isNil(val)) {
    val = parseFloat(val);
    _testIsNumber(opts, val);
    _testMin(opts, val);
    _testMax(opts, val);
    output[opts.name] = val;
  }
};

// TODO: test it
exports.processDateParam = (opts, output) => {
  let val = opts.from[opts.name];

  _testIsRequired(opts, val);

  if (!_.isNil(val)) {
    val = moment(val, moment.defaultFormat);
    _testIsDate(opts, val);
    output[opts.name] = val;
  }
};

// TODO: test it
exports.processId = (opts, output) => {
  opts.name = opts.name || 'id';
  let id = opts.from[opts.name];

  _testIsRequired(opts, id);

  if (!_.isNil(id)) {
    id = parseInt(id);
    if (!validations.isValidId(id)) {
      _throwUnprocessableRequestError(`${opts.name} must be a valid ID`);
    }
    output[opts.name] = id;
  }
};

// TODO: test it
exports.processIdList = (opts, output) => {
  opts.name = opts.name;
  let ids = opts.from[opts.name];

  _testIsRequired(opts, ids);

  if (!_.isNil(ids)) {
    if (!validations.isAllWithValidId(ids)) {
      _throwUnprocessableRequestError(`${opts.name} must be a valid list of IDs`);
    }
    output[opts.name] = ids;
  }
};

// TODO: test it
exports.processObjectId = (opts, output) => {
  opts.name = opts.name || 'id';
  let id = opts.from[opts.name];

  _testIsRequired(opts, id);

  if (!_.isNil(id)) {
    if (!validations.isValidObjectId(id)) {
      _throwUnprocessableRequestError(`${opts.name} must be a valid ObjectId`);
    }
    output[opts.name] = id;
  }
};

// TODO: test it
exports.processIn = (opts, output) => {
  opts.name = opts.name || 'in';
  let $in = opts.from[opts.name];

  _testIsRequired(opts, $in);

  if (!_.isNil($in)) {
    $in = _.map($in, val => parseInt(val));
    if (!validations.isAllWithValidId($in)) {
      _throwUnprocessableRequestError('in must contain a list of valid ids');
    }
    let field = opts.field || 'id';
    output[field] = output[field] || {};
    output[field].$in = $in;
  }
};

// TODO: test it
exports.processNin = (opts, output) => {
  opts.name = opts.name || 'nin';
  let $nin = opts.from[opts.name];

  _testIsRequired(opts, $nin);

  if (!_.isNil($nin)) {
    $nin = _.map($nin, val => parseInt(val));
    if (!validations.isAllWithValidId($nin)) {
      _throwUnprocessableRequestError('nin must contain a list of valid ids');
    }
    let field = opts.field || 'id';
    output[field] = output[field] || {};
    output[field].$notIn = $nin;
  }
};

/**
 * @deprecated Since version 1.0. Will be deleted in version 2.0.
 */
exports.processFilterByName = (opts, output) => {
  opts.name = 'filter';
  let filter = opts.from.filter;

  _testIsRequired(opts, filter);

  if (!_.isNil(filter)) {
    output.name = { $like: `%${filter}%` };
  }
};

// TODO: test it
exports.processFields = (opts, output) => {
  opts.name = 'fields';
  let fields = opts.from.fields || opts.def;

  if (!_.isNil(fields)) {
    if (!validations.isAllowedAttrs(fields, opts.allowed)) {
      _throwUnprocessableRequestError('fields must be a space separated string of fields');
    }
    output.fields = fields.split(' ');
  }
};

// TODO: test it
function _testIsRequired(opts, val) {
  if (opts.required && _.isNil(val)) {
    _throwUnprocessableRequestError(`${opts.name} is required`);
  }
}

// TODO: test it
function _testIsNumber(opts, val) {
  if (isNaN(val)) {
    _throwUnprocessableRequestError(`${opts.name} must be a number`);
  }
}

// TODO: test it
function _testIsDate(opts, val) {
  if (!moment(val).isValid()) {
    _throwUnprocessableRequestError(`${opts.name} must be a date`);
  }
}

// TODO: test it
function _testMin(opts, val) {
  if (!_.isNil(opts.min) && val < opts.min) {
    _throwUnprocessableRequestError(`${opts.name} must be greater than or equal to ${opts.min}`);
  }
}

// TODO: test it
function _testMax(opts, val) {
  if (!_.isNil(opts.max) && val > opts.max) {
    _throwUnprocessableRequestError(`${opts.name} must be less than or equal to ${opts.max}`);
  }
}

// TODO: test it
function _throwUnprocessableRequestError(message) {
  throw new _CustomErrorType(message);
}
