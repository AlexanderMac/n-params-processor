const _ = require('lodash');
const BaseBuilder = require('./base-builder');

class DataBuilder extends BaseBuilder {
  build() {
    return _.omit(this.data, '_temp_');
  }
}

module.exports = DataBuilder;
