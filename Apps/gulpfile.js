var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('build', function () {
    return browserify({entries: './Account.jsx', extensions: ['.jsx'], debug: true})
        .transform('babelify', {presets: ['es2015', 'es2016', 'es2017','react']})
        .bundle()
        .pipe(source('account.js'))
        .pipe(gulp.dest('../Public'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('*.jsx', ['build']);
});

gulp.task('default', ['watch']);