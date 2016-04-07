var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    path = require('path'),
    _ = require('lodash');
var del = require('del');
var plugins = gulpLoadPlugins();
var defaultTasks = ['clean', 'cssmin', 'cssmin-imagecomposer', 'uglify', 'uglify-imagecomposer'];
var assets = require('./assets.json');


gulp.task('cssmin', function () {
    console.log('in cssmin');
    var src = assets.css;
    if (src) {
        src.push("stylesheets/quotes/**/*.css");
        return gulp.src(src)
            .pipe(plugins.cssmin({keepBreaks: true}))
            .pipe(plugins.concat('dist.min.css'))
            .pipe(gulp.dest('build/'));
    }
    var imageComposer = [];
    if (imageComposer) {
        imageComposer.push("stylesheets/imagecomposer/**/*.css");
        return gulp.src(imageComposer)
            .pipe(plugins.cssmin({keepBreaks: true}))
            .pipe(plugins.concat('imagecomposer.min.css'))
            .pipe(gulp.dest('build/'));
    }
});


gulp.task('cssmin-imagecomposer', function () {
    console.log('cssmin-imagecomposer');
    var imageComposer = [];
    if (imageComposer) {
        imageComposer.push("stylesheets/imagecomposer/**/*.css");
        return gulp.src(imageComposer)
            .pipe(plugins.cssmin({keepBreaks: true}))
            .pipe(plugins.concat('dist.imagecomposer.min.css'))
            .pipe(gulp.dest('build/'));
    }
});


gulp.task('uglify', function () {
    console.log('in uglify');
    var src = assets.js;

    if (src) {
        src.push('angular/quotes/**/*.js');
        return gulp.src(src)
            .pipe(plugins.concat('dist.min.js'))
            .pipe(plugins.uglify({mangle: false}))
            .pipe(gulp.dest('build/'));
    }
});

gulp.task('uglify-imagecomposer', function () {
    console.log('uglify-imagecomposer');
    var src = assets.js;

    if (src) {
        src.push('angular/imagecomposer/**/*.js');
        return gulp.src(src)
            .pipe(plugins.concat('dist.imagecomposer.min.js'))
            .pipe(plugins.uglify({mangle: false}))
            .pipe(gulp.dest('build/'));
    }
});


gulp.task('clean', function (cb) {
    return del(['build/'], cb);
});

gulp.task('default', defaultTasks);