'use strict';

var gulp      = require('gulp');
var gistanbul = require('gulp-istanbul');
var gmocha    = require('gulp-mocha');
var config    = require('../config/gulp');
var filters   = require('../config/gulp').filters;
var paths     = require('../config/gulp').paths;

gulp.task('coverage', cb => {
  process.env.NODE_ENV = 'test';

  gulp.src(paths.lib + filters.jsDeep)
    .pipe(gistanbul({
      includeUntested: true
    }))
    .pipe(gistanbul.hookRequire())
    .on('finish', () => {
      gulp.src(paths.test + filters.jsDeep)
        .pipe(gmocha({ reporter: 'dot' }))
        .once('error', err => {
          console.error(err);
          process.exit(1);
        })
        .pipe(gistanbul.writeReports())
        .pipe(gistanbul.enforceThresholds({
          thresholds: { global: config.coverage.successPercent }
        }))
        .on('end', cb);
    });
});
