'use strict';

const moment     = require('moment');
const should     = require('should');
const validators = require('../src/validators');

describe('validators', () => {
  describe('isValidDateString', () => {
    function test(val, expected) {
      let actual = validators.isValidDateString(val);
      should(actual).equal(expected);
    }

    it('should return false when val is undefined', () => {
      let val;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is null', () => {
      let val = null;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals false', () => {
      let val = false;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals true', () => {
      let val = true;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number and equals zero', () => {
      let val = 0;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number', () => {
      let val = 123;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an object', () => {
      let val = {};
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an array', () => {
      let val = [1, 2, 3];
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a Date object', () => {
      let val = new Date();
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a Moment object', () => {
      let val = moment();
      let expected = false;
      test(val, expected);
    });

    it('should return false when val isn\'t a date string', () => {
      let val = 'string';
      let expected = false;
      test(val, expected);
    });

    it('should return true when val is a date string', () => {
      let val = '2016-01-01T00:00:00Z';
      let expected = true;
      test(val, expected);
    });
  });

  describe('isNotEmptyString', () => {
    function test(val, expected) {
      let actual = validators.isNotEmptyString(val);
      should(actual).equal(expected);
    }

    it('should return false when val is undefined', () => {
      let val;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is null', () => {
      let val = null;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals false', () => {
      let val = false;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals true', () => {
      let val = true;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number and equals zero', () => {
      let val = 0;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number', () => {
      let val = 123;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a Date object', () => {
      let val = new Date();
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an object', () => {
      let val = {};
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an array', () => {
      let val = [1, 2, 3];
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an empty string', () => {
      let val = '';
      let expected = false;
      test(val, expected);
    });

    it('should return true when val isn\'t an empty string', () => {
      let val = 'string';
      let expected = true;
      test(val, expected);
    });
  });

  describe('isValidId', () => {
    function test(val, expected) {
      let actual = validators.isValidId(val);
      should(actual).equal(expected);
    }

    it('should return false when val is undefined', () => {
      let val;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is null', () => {
      let val = null;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals false', () => {
      let val = false;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals true', () => {
      let val = true;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number less than zero', () => {
      let val = -5;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number and equals zero', () => {
      let val = 0;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a Date object', () => {
      let val = new Date();
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an object', () => {
      let val = {};
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an array', () => {
      let val = [1, 2, 3];
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an empty string', () => {
      let val = '';
      let expected = false;
      test(val, expected);
    });

    it('should return true when val is a positive number', () => {
      let val = 55;
      let expected = true;
      test(val, expected);
    });
  });

  describe('isValidObjectId', () => {
    function test(val, expected) {
      let actual = validators.isValidObjectId(val);
      should(actual).equal(expected);
    }

    it('should return false when val is undefined', () => {
      let val;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is null', () => {
      let val = null;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals false', () => {
      let val = false;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals true', () => {
      let val = true;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number and equals zero', () => {
      let val = 0;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number', () => {
      let val = 123;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a Date object', () => {
      let val = new Date();
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an object', () => {
      let val = {};
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an array', () => {
      let val = [1, 2, 3];
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an empty string', () => {
      let val = '';
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a string with invalid id', () => {
      let val = 'invalid id';
      let expected = false;
      test(val, expected);
    });

    it('should return true when val is a string with valid id', () => {
      let val = '0123456789abcdefABCDEF00';
      let expected = true;
      test(val, expected);
    });
  });

  describe('isValidEmail', () => {
    function test(val, expected) {
      let actual = validators.isValidEmail(val);
      should(actual).equal(expected);
    }

    it('should return false when val is undefined', () => {
      let val;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is null', () => {
      let val = null;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals false', () => {
      let val = false;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals true', () => {
      let val = true;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number and equals zero', () => {
      let val = 0;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number', () => {
      let val = 123;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a Date object', () => {
      let val = new Date();
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an object', () => {
      let val = {};
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an array', () => {
      let val = [1, 2, 3];
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an empty string', () => {
      let val = '';
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a string with invalid email', () => {
      let val = 'invalid email';
      let expected = false;
      test(val, expected);
    });

    it('should return true when val is a string with valid email', () => {
      let val = 'valid-email@mail.com';
      let expected = true;
      test(val, expected);
    });
  });

  describe('isAllWithValidId', () => {
    function test(val, expected) {
      let actual = validators.isAllWithValidId(val);
      should(actual).equal(expected);
    }

    it('should return false when val is undefined', () => {
      let val;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is null', () => {
      let val = null;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals false', () => {
      let val = false;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals true', () => {
      let val = true;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number and equals zero', () => {
      let val = 0;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number', () => {
      let val = 123;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a Date object', () => {
      let val = new Date();
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an object', () => {
      let val = {};
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an empty string', () => {
      let val = '';
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is isn\'t an empty string', () => {
      let val = 'string';
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an array with some invalid ids', () => {
      let val = [11, null, 33];
      let expected = false;
      test(val, expected);
    });

    it('should return true when val is an empty array', () => {
      let val = [];
      let expected = true;
      test(val, expected);
    });

    it('should return true when val is an array with valid ids', () => {
      let val = [11, 22, 33];
      let expected = true;
      test(val, expected);
    });
  });

  describe('isAllWithValidObjectId', () => {
    function test(val, expected) {
      let actual = validators.isAllWithValidObjectId(val);
      should(actual).equal(expected);
    }

    it('should return false when val is undefined', () => {
      let val;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is null', () => {
      let val = null;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals false', () => {
      let val = false;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a boolean and equals true', () => {
      let val = true;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number and equals zero', () => {
      let val = 0;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a number', () => {
      let val = 123;
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is a Date object', () => {
      let val = new Date();
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an object', () => {
      let val = {};
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an empty string', () => {
      let val = '';
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is isn\'t an empty string', () => {
      let val = 'string';
      let expected = false;
      test(val, expected);
    });

    it('should return false when val is an array with some invalid ids', () => {
      let val = ['0123456789abcdefABCDEF00', null, '0123456789abcdefABCDEF11'];
      let expected = false;
      test(val, expected);
    });

    it('should return true when val is an empty array', () => {
      let val = [];
      let expected = true;
      test(val, expected);
    });

    it('should return true when val is an array with valid ids', () => {
      let val = ['0123456789abcdefABCDEF00', '0123456789abcdefABCDEF11', '0123456789abcdefABCDEF22'];
      let expected = true;
      test(val, expected);
    });
  });

  describe('isAllAllowed', () => {
    const DEF_ALLOWED = ['a', 'b', 'c'];

    function test(val, allowed, expected) {
      let actual = validators.isAllAllowed(val, allowed);
      should(actual).equal(expected);
    }

    it('should return false when val is undefined', () => {
      let val;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is null', () => {
      let val = null;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is a boolean and equals false', () => {
      let val = false;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is a boolean and equals true', () => {
      let val = true;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is a number and equals zero', () => {
      let val = 0;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is a number', () => {
      let val = 123;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is a Date object', () => {
      let val = new Date();
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is an object', () => {
      let val = {};
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is an empty string', () => {
      let val = '';
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is isn\'t an empty string', () => {
      let val = 'string';
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is an array with not allowed items', () => {
      let val = ['a', 'b', 'd'];
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return true when val is an empty array', () => {
      let val = [];
      let expected = true;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return true when val is an array with allowed items', () => {
      let val = ['a', 'b'];
      let expected = true;
      test(val, DEF_ALLOWED, expected);
    });
  });

  describe('isAllowedStringFields', () => {
    const DEF_ALLOWED = 'a b c';

    function test(val, allowed, expected) {
      let actual = validators.isAllowedStringFields(val, allowed);
      should(actual).equal(expected);
    }

    it('should return false when val is undefined', () => {
      let val;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is null', () => {
      let val = null;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is a boolean and equals false', () => {
      let val = false;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is a boolean and equals true', () => {
      let val = true;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is a number and equals zero', () => {
      let val = 0;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is a number', () => {
      let val = 123;
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is a Date object', () => {
      let val = new Date();
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is an object', () => {
      let val = {};
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is an empty string', () => {
      let val = '';
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return false when val is a string with not allowed attrs', () => {
      let val = 'a b d';
      let expected = false;
      test(val, DEF_ALLOWED, expected);
    });

    it('should return true when val is a string with allowed items', () => {
      let val = 'a c';
      let expected = true;
      test(val, DEF_ALLOWED, expected);
    });
  });
});
