var gulp = require('gulp');

gulp.task('default', function() {
  gulp.src(['*/*.css', 'sections/*', 'services/*', 'locales/*', 'lib/*', 'img/*'])
  .pipe(gulp.dest('dist/'));
});
