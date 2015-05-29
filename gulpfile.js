var gulp = require('gulp');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var minifyCss = require('gulp-minify-css');
var browserify = require('browserify');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');


var isProduction = !!(gutil.env.production);

if (isProduction) {
    console.warn('Building production assets');
}

var paths = {
    scripts: {
        source: 'js/app.js',
        dest: 'public/js'
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
    debug: isProduction,
    noparse: ['jquery', 'lodash', 'three', 'backbone', 'backbone-class']
}

if (isProduction) {
    var b = browserify(options);
} else {
    var b = watchify(browserify(options));
}

b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        // Prepare the output
        .pipe(source('app.js'))
        .pipe(plumber())
        .pipe(buffer())
        // Sourcemaps
        .pipe(gulpif(!isProduction, sourcemaps.init({loadMaps: true})))
        .pipe(gulpif(!isProduction, sourcemaps.write('./')))
        // Uglify
        .pipe(gulpif(isProduction, uglify()))
        // Write to destination
        .pipe(gulp.dest(paths.scripts.dest))
        // After build
        .pipe(gulpif(!isProduction, livereload()))
        .pipe(notify('Browserify compiled'));
}

gulp.task('scripts', bundle);


/**
 * SASS
 */
gulp.task('sass', function () {
    gulp.src(paths.css)
        .pipe(plumber())
        .pipe(gulpif(!isProduction, sourcemaps.init()))
        .pipe(sass({
            includePaths: require('node-bourbon').includePaths
        }))
        .pipe(gulpif(!isProduction, sourcemaps.write()))
        .pipe(gulpif(isProduction, minifyCss()))
        .pipe(gulp.dest('public/css'))
        .pipe(gulpif(!isProduction, livereload()))
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
    if (!isProduction) {
        gulp.watch(paths.css, ['sass']);
    }
});


gulp.task('default', ['sass', 'scripts', 'watch']);
