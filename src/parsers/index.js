'use strict';

module.exports = {
  BaseParser: require('./base-parser'),

  StringParser: require('./string-parser'),
  DateParser: require('./date-parser'),
  JsonParser: require('./json-parser'),
  BoolParser: require('./bool-parser'),

  NumberParser: require('./number-parsers/number-parser'),
  IntParser: require('./number-parsers/int-parser'),
  FloatParser: require('./number-parsers/float-parser'),
  IdParser: require('./number-parsers/id-parser'),

  RegexpParser: require('./regexp-parsers/regexp-parser'),
  ObjectIdParser: require('./regexp-parsers/objectid-parser'),

  ArrayParser: require('./array-parser')
};
