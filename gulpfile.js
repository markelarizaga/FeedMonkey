var gulp = require('gulp');
var clean = require('gulp-clean');
var zip = require('gulp-zip');

gulp.task('delete-dist', function(){
  return gulp.src('dist')
        .pipe(clean());
});

gulp.task('move-to-dist', ['delete-dist'], function() {
  return gulp.src([
            '*/**/*.css',
            '**/*.js',
            '**/*.html',
            '*/**/*.png',
            '*/**/*.svg',
            'manifest.webapp',
            '!node_modules/**',
            '!bower_components/**',
            '!gulpfile.js'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('move-dependencies', ['move-to-dist'], function(){
  return gulp.src([
            'bower_components/**/*.min.js'])
        .pipe(gulp.dest('dist/bower_components/'));
});

gulp.task('default', [
        'move-to-dist',
        'move-dependencies'
      ],
    function(){
      return gulp.src('dist/**')
            .pipe(zip('ttrss.zip'))
            .pipe(gulp.dest('dist/'));
    });
