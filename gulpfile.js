var gulp = require('gulp');
var es = require('event-stream');

var staged = require('./lib/gulp-git-staged');
var debug = es.map(function (file, cb) {
	console.log('file:', file);
	cb();
});

gulp.task('default', function () {
	staged(['*/**/*'], {
		base: '.'
	})
		.pipe(debug);
});

