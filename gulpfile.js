'use strict';
var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

var paths = {
  ts: ['src/**/*.ts'],
  specs: ['dist/**/*.spec.js', 'dist/**/*.ispec.js', 'dist/tests'],
  graphQl: ['src/**/*.graphql'],
  json: ['src/**/*.json'],
  js: [`builds/**/*.js`]
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
gulp.task('ts', function() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(`${dest}/`));
});

// Remove all test related files
gulp.task('rmv-tests', function() {
  return del(paths.specs);
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.ts, gulp.series('ts'));
  gulp.watch(paths.graphQl, gulp.series('graphql'));
  gulp.watch(paths.json, gulp.series('json'));
});

// Build task
// Also watched files
gulp.task(
  'build',
  gulp.series('clean', gulp.parallel('graphql', 'ts', 'json'), gulp.series('watch'))
);

// Distribution task.
// Removes test
gulp.task(
  'dist',
  gulp.series('clean', gulp.parallel('graphql', 'ts', 'json'), gulp.series('rmv-tests'))
);

// // Default task is to run the build
gulp.task('default', gulp.series('build'));
