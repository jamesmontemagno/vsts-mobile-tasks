var gulp = require('gulp');
 
require('require-dir')('./build')

gulp.task('default', ['build'], function() {
   return null;
}); 