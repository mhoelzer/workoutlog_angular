var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');

var javascriptFiles = [
	'app.js',
	'./components/**/*.js',
	'./services/**/*.js',
];

gulp.task('bundle', function(){
	return gulp.src(javascriptFiles)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest("./content"));
});

gulp.task('watch', function(){
	gulp.watch(javascriptFiles, ['bundle']);
});

gulp.task('start-webserver', function(){
	connect.server({ root: '.' });
});

// Default task when 'gulp' runs: bundle, starts web server, then watches for chnges
//  the task is the gulpefault (default) task and will execute each of these when gulp is run on the command line in this folder.
gulp.task('default', ['bundle', 'start-webserver', 'watch']);