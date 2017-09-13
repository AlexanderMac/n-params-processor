'use strict';

var _      = require('lodash');
var moment = require('moment');

module.exports = {
  // TODO: test it
  isValidDateString: function(val) {
    return _.isString(val) && moment(val, moment.defaultFormat).isValid();
  },
  // TODO: test it
  isNotEmptyString: function(val) {
    return _.isString(val) && val.length > 0;
  },
  // TODO: test it
  isValidObjectId: function(val) {
    var regexp = /^[0-9a-fA-F]{24}$/;
    return _.isString(val) && regexp.test(val);
  },
  // TODO: test it
  isValidId: function(val) {
    return _.isNumber(val) && val > 0;
  },
  // TODO: test it
  isValidEmail: function(val) {
    var regexp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return _.isString(val) && regexp.test(val);
  },
  // TODO: test it
  isValidPhone: function(number) {
    if (!number ||
      typeof number !== 'string' ||
      number.length < 8 ||
      number.indexOf('+') !== 0) {
      return false;
    }
    return true;
  },
  // TODO: test it
  isAllWithValidObjectId: function(items) {
    return _.isArray(items) && _.every(items, this.isValidObjectId) && _.uniq(items).length === items.length;
  },
  // TODO: test it
  isAllWithValidId: function(items) {
    return _.isArray(items) && _.every(items, this.isValidId) && _.uniq(items).length === items.length;
  },
  // TODO: test it
  isAllWithValidObjectIdOrNull: function(items) {
    var self = this;
    return _.isArray(items) && _.every(items, id => _.isNull(id) || self.isValidObjectId(id));
  },
  // TODO: test it
  isAllAllowed: function(checked, allowed) {
    return _.isArray(checked) &&  _.difference(checked, allowed).length === 0;
  },
  // TODO: test it
  isAllowedAttrs: function(checked, allowed) {
    if (!_.isString(checked)) {
      return false;
    }
    var checkedAttrs = checked.split(' ');
    var allowedAttrs = allowed.split(' ');
    return _.difference(checkedAttrs, allowedAttrs).length === 0;
  }
};
