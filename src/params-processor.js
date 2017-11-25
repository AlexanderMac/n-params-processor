'use strict';

const _          = require('lodash');
const moment     = require('moment');
const validators = require('./validators');

let _CustomErrorType = Error;

exports.registerCustomErrorType = (CustomErrorType) => {
  _CustomErrorType = CustomErrorType;
};

exports.getEmptyParams = (filter) => {
  return {
    filter: filter || {},
    fields: []
  };
};

// TODO: rename to getEmptyDataObject
exports.getEmptyObjectData = (data) => {
  return data || {};
};

// TODO: rename to parseDataObject
exports.parseObjectData = (opts, data) => {
  let newData = _.pick(opts.from, opts.allowed);
  _.extend(data, newData);
};

exports.processStringParam = (opts, output) => {
  _testOptsAreValid(opts.from, opts.name);

  let val = opts.from[opts.name];

  _testIsRequired(opts, val);

  if (!_.isNil(val)) {
    val = val.toString();
    if (opts.allowed && !_.includes(opts.allowed, val)) {
      _throwUnprocessableRequestError(`${opts.name} has incorrect value`);
    }
    output[opts.name] = val;
  }
};

exports.processIntParam = (opts, output) => {
  _testOptsAreValid(opts.from, opts.name);

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

exports.processFloatParam = (opts, output) => {
  _testOptsAreValid(opts.from, opts.name);

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

exports.processDateParam = (opts, output) => {
  _testOptsAreValid(opts.from, opts.name);

  let val = opts.from[opts.name];

  _testIsRequired(opts, val);

  if (!_.isNil(val)) {
    val = moment(val, moment.defaultFormat); // TODO: convert to date
    _testIsDate(opts, val);
    output[opts.name] = val;
  }
};

exports.processId = (opts, output) => {
  opts.name = opts.name || 'id'; // TODO: don't use default param
  _testOptsAreValid(opts.from, opts.name);

  let id = opts.from[opts.name];

  _testIsRequired(opts, id);

  if (!_.isNil(id)) {
    id = parseInt(id);
    if (!validators.isValidId(id)) {
      _throwUnprocessableRequestError(`${opts.name} must be a valid ID`);
    }
    output[opts.name] = id;
  }
};

exports.processIdList = (opts, output) => {
  _testOptsAreValid(opts.from, opts.name);

  let ids = opts.from[opts.name];

  _testIsRequired(opts, ids);

  if (!_.isNil(ids)) {
    if (!validators.isAllWithValidId(ids)) {
      _throwUnprocessableRequestError(`${opts.name} must be a valid list of IDs`);
    }
    output[opts.name] = ids;
  }
};

exports.processObjectId = (opts, output) => {
  opts.name = opts.name || 'id'; // TODO: don't use default param
  _testOptsAreValid(opts.from, opts.name);

  let id = opts.from[opts.name];

  _testIsRequired(opts, id);

  if (!_.isNil(id)) {
    if (!validators.isValidObjectId(id)) {
      _throwUnprocessableRequestError(`${opts.name} must be a valid ObjectId`);
    }
    output[opts.name] = id;
  }
};

exports.processIn = (opts, output) => {
  opts.name = opts.name || 'in'; // TODO: don't use default param
  _testOptsAreValid(opts.from, opts.name);

  let $in = opts.from[opts.name];

  _testIsRequired(opts, $in);

  if (!_.isNil($in)) {
    $in = _.map($in, val => parseInt(val));
    if (!validators.isAllWithValidId($in)) {
      _throwUnprocessableRequestError('in must contain a list of valid IDs');
    }
    let field = opts.field || 'id';
    output[field] = output[field] || {};
    output[field].$in = $in;
  }
};

exports.processNin = (opts, output) => {
  opts.name = opts.name || 'nin'; // TODO: don't use default param
  _testOptsAreValid(opts.from, opts.name);

  let $nin = opts.from[opts.name];

  _testIsRequired(opts, $nin);

  if (!_.isNil($nin)) {
    $nin = _.map($nin, val => parseInt(val));
    if (!validators.isAllWithValidId($nin)) {
      _throwUnprocessableRequestError('nin must contain a list of valid IDs');
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

exports.processFields = (opts, output) => {
  opts.name = 'fields'; // TODO: don't use default param
  _testOptsAreValid(opts.from, opts.name);

  let fields = opts.from.fields || opts.def;

  if (!_.isNil(fields)) {
    if (!validators.isAllowedStringFields(fields, opts.allowed)) {
      _throwUnprocessableRequestError('fields must be a space separated string of fields');
    }
    output.fields = fields.split(' ');
  }
};

// TODO: test it
function _testOptsAreValid(from, name) {
  if (_.isNil(from)) {
    throw new Error('Impossible parse parameter. From is not provided');
  }
  if (_.isNil(name)) {
    throw new Error('Impossible parse parameter. Name is not provided');
  }
}

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
