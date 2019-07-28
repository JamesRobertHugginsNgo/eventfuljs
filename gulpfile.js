const babel = require('gulp-babel');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const webServer = require('gulp-webserver');

function cleanup() {
	return del('dist/');
}

function buildJavaScripts() {
	return gulp.src('src/**/*.js', { since: gulp.lastRun(buildJavaScripts) })
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(babel())
		.pipe(gulp.dest('dist/'));
}

exports.default = gulp.series(cleanup, buildJavaScripts);

function watch() {
	gulp.watch('src/**/*.js', buildJavaScripts);
}

exports.watch = gulp.series(exports.default, watch);

function serve() {
	gulp.src('dist/').pipe(webServer({
		directoryListing: { enable: true, path: 'dist/' },
		livereload: true,
		open: true,
		port: process.env.PORT || 8080
	}));

	watch();
}

exports.serve = gulp.series(exports.default, serve);

function serveTest() {
	gulp.src('./').pipe(webServer({
		directoryListing: { enable: true, path: './' },
		livereload: true,
		open: true,
		port: process.env.PORT || 8080
	}));

	watch();
}

exports.test = gulp.series(exports.default, serveTest);
