var gulp = require('gulp');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var watchify = require('watchify');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var notify = require('gulp-notify');

var paths = {
    scripts: {
        source: ['js/app.js']
    },
    css: [
        'css/main.scss'
    ]
};


/**
 * Browserify
 */
var options = {
    entries: [paths.scripts.source],
    insertGlobals: true,
    debug: true,
    noparse: ['jquery', 'lodash', 'three', 'backbone', 'backbone-class']
}

var b = watchify(browserify(options));

b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/js'))
        .pipe(livereload())
        .pipe(notify('Browserify compiled'));
}

gulp.task('scripts', bundle);


/**
 * SASS
 */
gulp.task('sass', function () {
    gulp.src(paths.css)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: require('node-bourbon').includePaths
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .pipe(livereload())
        .pipe(notify('SASS compiled'));
});


/** Server **/
gulp.task('server', function () {
    nodemon({
        script: 'server.js'
    })
});


/** Watch task **/
gulp.task('watch', function () {
    gulp.watch(paths.css, ['sass']);
});


gulp.task('default', ['sass', 'scripts', 'watch']);
