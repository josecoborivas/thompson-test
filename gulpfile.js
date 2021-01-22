// Archivo gulpfile.json

const { src, parallel, series, dest, watch } = require('gulp');
const gulp = require('gulp'), 
      sass = require('gulp-sass'),
      //autoprefixer = require('gulp-autoprefixer'),
      browsersync = require('browser-sync'),
      imagemin = require('gulp-imagemin'),
      sourcemaps = require('gulp-sourcemaps'),
      concat = require('gulp-concat'),
      terser = require('gulp-terser'),
      postcss = require('gulp-postcss'),
      cssnano = require('cssnano'),
      autoprefixer = require('autoprefixer');

const jsPath = 'js/*.js';
const cssPath = 'css/*.css';

function copyHtml(){
  return src('*.html').pipe(gulp.dest('dist'));
}      

function imgTask(){
  return src('assets/img/*').pipe(imagemin()).pipe(gulp.dest('dist/assets/img'));
}

function jsTask(){
  return src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('all.js')
    .pipe(terser()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/js'));
}

function cssTask(){
  return src(cssPath)
  .pipe(sourcemaps.init())
  .pipe(concat('style.css'))
  .pipe(postcss([autoprefixer(), cssnano()]))
  .pipe(sourcemaps.write('.'))
  .pipe(dest('dist/css'));
}

function watchTask(){
  watch([cssPath, jsPath], {interval: 1000}, parallel(cssTask, jsTask));
}

exports.copyHtml = copyHtml;
exports.imgTask = imgTask;
exports.jsTask = jsTask;
exports.cssTask = cssTask;
exports.default = series(
  parallel(copyHtml, imgTask, jsTask, cssTask),
  watchTask);
