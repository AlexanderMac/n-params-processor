'use strict';

const moment      = require('moment');
const should      = require('should');
const validations = require('../../src/validations');

describe('validations', () => {
  describe('isValidDateString', () => {
    let test = (val, expected) => {
      let actual = validations.isValidDateString(val);
      should(actual).equal(expected);
    };

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
    let test = (val, expected) => {
      let actual = validations.isNotEmptyString(val);
      should(actual).equal(expected);
    };

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
    let test = (val, expected) => {
      let actual = validations.isValidId(val);
      should(actual).equal(expected);
    };

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
    let test = (val, expected) => {
      let actual = validations.isValidObjectId(val);
      should(actual).equal(expected);
    };

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
    let test = (val, expected) => {
      let actual = validations.isValidEmail(val);
      should(actual).equal(expected);
    };

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
    let test = (val, expected) => {
      let actual = validations.isAllWithValidId(val);
      should(actual).equal(expected);
    };

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
    let test = (val, expected) => {
      let actual = validations.isAllWithValidObjectId(val);
      should(actual).equal(expected);
    };

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
    let defaultAllowed = ['a', 'b', 'c'];

    let test = (val, allowed, expected) => {
      let actual = validations.isAllAllowed(val, allowed);
      should(actual).equal(expected);
    };

    it('should return false when val is undefined', () => {
      let val;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is null', () => {
      let val = null;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is a boolean and equals false', () => {
      let val = false;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is a boolean and equals true', () => {
      let val = true;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is a number and equals zero', () => {
      let val = 0;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is a number', () => {
      let val = 123;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is a Date object', () => {
      let val = new Date();
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is an object', () => {
      let val = {};
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is an empty string', () => {
      let val = '';
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is isn\'t an empty string', () => {
      let val = 'string';
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is an array with not allowed items', () => {
      let val = ['a', 'b', 'd'];
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return true when val is an empty array', () => {
      let val = [];
      let expected = true;
      test(val, defaultAllowed, expected);
    });

    it('should return true when val is an array with allowed items', () => {
      let val = ['a', 'b'];
      let expected = true;
      test(val, defaultAllowed, expected);
    });
  });

  describe('isAllowedAttrs', () => {
    let defaultAllowed = 'a b c';

    let test = (val, allowed, expected) => {
      let actual = validations.isAllowedAttrs(val, allowed);
      should(actual).equal(expected);
    };

    it('should return false when val is undefined', () => {
      let val;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is null', () => {
      let val = null;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is a boolean and equals false', () => {
      let val = false;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is a boolean and equals true', () => {
      let val = true;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is a number and equals zero', () => {
      let val = 0;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is a number', () => {
      let val = 123;
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is a Date object', () => {
      let val = new Date();
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is an object', () => {
      let val = {};
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is an empty string', () => {
      let val = '';
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return false when val is a string with not allowed attrs', () => {
      let val = 'a b d';
      let expected = false;
      test(val, defaultAllowed, expected);
    });

    it('should return true when val is a string with allowed items', () => {
      let val = 'a c';
      let expected = true;
      test(val, defaultAllowed, expected);
    });
  });
});
