var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    path = require('path'),
    _ = require('lodash');
var del = require('del');
var plugins = gulpLoadPlugins();
var defaultTasks = ['clean', 'cssmin', 'uglify'];
var assets = require('./assets.json');


gulp.task('cssmin', function () {
    console.log('in cssmin');
    var src = assets.css;
    if (src) {
        src.push("stylesheets/**/*.css");
        return gulp.src(src)
            .pipe(plugins.cssmin({keepBreaks: true}))
            .pipe(plugins.concat('dist.min.css'))
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

gulp.task('clean', function (cb) {
    return del(['build/'], cb);
});

gulp.task('default', defaultTasks);