'use strict';

const ParamsProc = require('./params-processor');

class DataBuilder extends ParamsProc {
  constructor({ baseData, source } = {}) {
    let data = baseData || {};
    super({ source, dest: data });
    this.data = data;
  }

  build() {
    return this.data;
  }
}

module.exports = DataBuilder;
