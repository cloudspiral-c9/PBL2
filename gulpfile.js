'use strict';

var gulp, sass,connect,autoprefixer,uglify,minifyHTML;

gulp = require("gulp");
sass = require('gulp-ruby-sass');
connect = require('gulp-connect');
autoprefixer = require('gulp-autoprefixer');
uglify = require('gulp-uglify');
minifyHTML = require('gulp-minify-html');

gulp.task('connectDev', function () {
  connect.server({
    root:['./public/'],
    port:8000,
    livereload:true
  });
});

gulp.task('reload',function() {
  gulp.src('./public/view/*.html')
    .pipe(connect.reload());
});

gulp.task('html',function(){
  gulp.src('./public/view/*.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./public/view-min'));
});

gulp.task('sass', function () {
  gulp.src('./public/sass/*.scss')
    .pipe(sass({
      style: 'compressed'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('js',function(){
  gulp.src('./public/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js-min'));

  gulp.src('./public/js/controllers/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js-min/controllers'));

    gulp.src('./public/js/derectives/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js-min/derectives'));

    gulp.src('./public/js/filters/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js-min/filters'));

    gulp.src('./public/js/services/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js-min/services'));

    gulp.src('./public/js/util/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js-min/util'));
});

gulp.task('watch',function() {
  gulp.watch(['./public/view/*.html'],['html']);
  gulp.watch(['./public/sass/*.scss'],['sass']);
  gulp.watch(['./public/js/*.js'],['js']);
  gulp.watch(['./public/view/*.html'],['reload']);
  gulp.watch(['./public/css/*.css'],['reload']);
  gulp.watch(['./public/js/*.js'],['reload']);
});

gulp.task('default', ['watch','connectDev']);
