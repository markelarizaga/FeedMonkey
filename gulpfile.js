var gulp = require('gulp');
var clean = require('gulp-clean');
var zip = require('gulp-zip');

gulp.task('delete-dist', function(){
  return gulp.src('dist')
    .pipe(clean());
});

gulp.task('default', ['delete-dist'], function() {
  gulp.src(['*/**/*.css',
            '**/*.js',
            '**/*.html',
            '*/**/*.png',
            '*/**/*.svg',
            'manifest.webapp',
            '!node_modules/**',
            '!gulpfile.js'])
  .pipe(zip('ttrss.zip'))
  .pipe(gulp.dest('dist/'));
});
