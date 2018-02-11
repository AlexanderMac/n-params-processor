'use strict';

const BaseParser = require('./src/parsers/base-parser');

module.exports = {
  consts: require('./src/consts'),
  registerCustomErrorType: (params) => BaseParser.registerCustomErrorType(params),
  DataBuilder: require('./src/data-builder'),
  MongooseQB: require('./src/mongoose-query-builder'),
  SequelizeQB: require('./src/sequelize-query-builder')
};
