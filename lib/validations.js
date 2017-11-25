'use strict';

const _      = require('lodash');
const moment = require('moment');

class Validations {
  isValidDateString(val) {
    return _.isString(val) && moment(val, moment.defaultFormat).isValid();
  }

  isNotEmptyString(val) {
    return _.isString(val) && val.length > 0;
  }

  isValidId(val) {
    return _.isNumber(val) && val > 0;
  }

  isValidObjectId(val) {
    let regexp = /^[0-9a-fA-F]{24}$/;
    return _.isString(val) && regexp.test(val);
  }

  isValidEmail(val) {
    let regexp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return _.isString(val) && regexp.test(val);
  }

  isAllWithValidId(items) {
    return _.isArray(items) && _.every(items, this.isValidId) && _.uniq(items).length === items.length;
  }

  isAllWithValidObjectId(items) {
    return _.isArray(items) && _.every(items, this.isValidObjectId) && _.uniq(items).length === items.length;
  }

  isAllAllowed(checked, allowed) {
    return _.isArray(checked) &&  _.difference(checked, allowed).length === 0;
  }

  isAllowedAttrs(checked, allowed) {
    if (!_.isString(checked)) {
      return false;
    }
    let checkedAttrs = checked.split(' ');
    let allowedAttrs = allowed.split(' ');
    return _.difference(checkedAttrs, allowedAttrs).length === 0;
  }
}

module.exports = new Validations();
