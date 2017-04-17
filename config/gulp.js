'use strict';

const CONFIG = './config/';
const TASKS  = './tasks/';
const LIB    = './lib/';
const TEST   = './test/';
const BUILD  = './build/';

let config = {
  filters: {
    all: '*.*',
    allDeep: '**/*.*',
    js: '*.js',
    jsDeep: '**/*.js'
  },

  paths: {
    config: CONFIG,
    tasks: TASKS,
    lib: LIB,
    test: TEST,
    build: BUILD
  },
  coverage: {
    successPercent: 30
  }
};

module.exports = config;
