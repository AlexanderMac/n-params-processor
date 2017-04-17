'use strict';

var gulp    = require('gulp');
var jshint  = require('gulp-jshint');
var filters = require('../config/gulp').filters;
var paths   = require('../config/gulp').paths;

gulp.task('lint-lib', () => {
  return _lint([
      paths.config + filters.jsDeep,
      paths.tasks + filters.jsDeep,
      paths.lib + filters.jsDeep
    ], '.jshintrc');
});

gulp.task('lint-test', () => {
  return _lint([
      paths.test + filters.jsDeep
    ], './test/.jshintrc');
});

gulp.task('lint', ['lint-lib', 'lint-test']);

let _lint = (scriptPaths, jshintPath) => {
  return gulp
    .src(scriptPaths)
    .pipe(jshint(jshintPath))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
};
