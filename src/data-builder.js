'use strict';

const BaseBuilder = require('./base-builder');

class DataBuilder extends BaseBuilder {
  build() {
    return this.data;
  }
}

module.exports = DataBuilder;
