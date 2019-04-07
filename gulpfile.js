'use strict';
const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const devTsProject = ts.createProject('tsconfig.json');
const prodTsProject = ts.createProject('tsconfig.json', { sourceMap: false });

const paths = {
  ts: ['src/**/*.ts'],
  specs: ['dist/**/*.spec.js', 'dist/**/*.e2e.js', 'dist/tests'],
  graphQl: ['src/**/*.graphql'],
  json: ['src/**/*.json'],
  js: ['builds/**/*.js']
};

// Output destination folder
const dest = 'dist';

// Function the deletes all files in the destingation folder
gulp.task('clean', function() {
  return del([`${dest}`]);
});

// Copy all graphQL files accross
gulp.task('graphql', function() {
  return gulp.src(paths.graphQl).pipe(gulp.dest(`${dest}/`));
});

// Copy all JSON files
gulp.task('json', function() {
  return gulp.src(paths.json).pipe(gulp.dest(`${dest}/`));
});

// Compiles the typescript based on the project tsconfig
gulp.task('dev-ts', function() {
  return devTsProject
    .src()
    .pipe(devTsProject())
    .js.pipe(gulp.dest(`${dest}/`));
});

// Compiles the typescript based on the project tsconfig
gulp.task('prod-ts', function() {
  return prodTsProject
    .src()
    .pipe(prodTsProject())
    .js.pipe(gulp.dest(`${dest}/`));
});

// Remove all test related files
gulp.task('rmv-tests', function() {
  return del(paths.specs);
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.ts, gulp.series('dev-ts'));
  gulp.watch(paths.graphQl, gulp.series('graphql'));
  gulp.watch(paths.json, gulp.series('json'));
});

// Build task & Watch
gulp.task(
  'dev',
  gulp.series('clean', gulp.parallel('graphql', 'dev-ts', 'json'), gulp.series('watch'))
);

// Distribution task, also removes all spec files.
// Removes test
gulp.task(
  'prod',
  gulp.series('clean', gulp.parallel('graphql', 'prod-ts', 'json'), gulp.series('rmv-tests'))
);

// Default task is to run the build
gulp.task('default', gulp.series('dev'));
