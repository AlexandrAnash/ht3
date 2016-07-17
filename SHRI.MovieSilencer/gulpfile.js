var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var clean = require("gulp-clean");

const clientPath = 'client-src';
const clientDestPath = 'client-dest';
const resource = [
    `${clientPath}/**/*.{html,css}`,
    `${clientPath}/{img,attachment}/*.*`
];
// Static server
gulp.task('browser-sync', function() {
    
});
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: `./${clientDestPath}`
        }
    });
    gulp.watch(`${clientPath}/**/*.js`, ['build-js']);
    gulp.watch(resource, ['resource']);
    gulp.watch(`${clientDestPath}/**/*.{html,js,css}`).on('change', browserSync.reload);
    gulp.watch(`${clientDestPath}/img/*.*`).on('change', browserSync.reload);
});
gulp.task('build-js', function () {
    return gulp.src(`${clientPath}/js/app.js`)
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(`${clientDestPath}/js`));
});
gulp.task('resource', function() {
    return gulp.src(resource)
        .pipe(gulp.dest(`${clientDestPath}/`));
});
gulp.task('default', ['build-js', 'resource']);
gulp.task('clean', function() {
    return gulp.src(`${clientDestPath}`)
        .pipe(clean());
});
