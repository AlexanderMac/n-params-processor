'use strict';

const registerCustomErrorType = require('./src/parsers/base-parser').registerCustomErrorType;

// TODO: test it
module.exports = {
  consts: require('./src/consts'),
  registerCustomErrorType,
  DataBuilder: require('./src/data-builder'),
  MongooseQB: require('./src/mongoose-query-builder'),
  SequelizeQB: require('./src/sequelize-query-builder')
};
