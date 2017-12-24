'use strict';

const should         = require('should');
const ObjectIdParser = require('../../../src/parsers/regexp-parsers/objectid-parser');

describe('parsers / regexp-parsers / objectid-parser', () => {
  describe('_getRegexp', () => {
    it('should return ObjectId regexp', () => {
      let instance = new ObjectIdParser({});

      let expected = /^[0-9a-fA-F]{24}$/;
      let actual = instance._getRegexp();
      should(actual).eql(expected);
    });
  });
});
