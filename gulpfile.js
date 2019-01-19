"use strict";

// Load plugins
const gulp = require('gulp');
const pug = require('gulp-pug');
const pugLinter = require('gulp-pug-linter');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const csscomb = require('gulp-csscomb');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const clean = require('gulp-clean');
const watch = require('gulp-watch');
const browsersync = require("browser-sync").create();


const devDir = './project/dev/';
const prodDir = './project/prod/';

gulp.task('browser-sync', () => {
    browsersync.init({
        server: {
            baseDir: prodDir
        }
    });
});


gulp.task('sass', () => {
    return gulp
        .src(devDir + 'blocks/**/*.sass')
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(csscomb())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(prodDir + 'css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(prodDir + 'css'))
        .pipe(browsersync.stream());
});

gulp.task('js', () => {
    return gulp
        .src(devDir + 'blocks/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(prodDir + 'js'))
});


gulp.task('pug', () => {
    return gulp
        .src(devDir + 'pages/*.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(prodDir))
        .on('end', browsersync.reload);
});


gulp.task('watch', () => {
    gulp.watch(devDir + 'blocks/**/*.sass', gulp.series('sass')).on('change', browsersync.reload);
    gulp.watch(devDir + 'blocks/**/*.js', gulp.series('js'));
    gulp.watch(devDir + 'blocks/**/*.pug', gulp.series('pug'));
    gulp.watch(devDir + 'pages/*.pug', gulp.series('pug'));
});


gulp.task('server', gulp.series(
    gulp.parallel('pug', 'sass', 'js'),
    gulp.parallel('watch', 'browser-sync')
));