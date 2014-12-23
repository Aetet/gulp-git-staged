var through = require('through2');
var es = require('event-stream');
var spawn = require('child_process').spawn;
var vfs = require('vinyl-fs');
var micromatch = require('micromatch');

function accum () {
	var out = [];
	var ts = through.obj(function (data, enc, cb) {
		if (data.toString()) {
			out.push(data.toString());
		}
		cb(null);
	}, function (cb) {
		this.push(out);
		cb();
	});

	return ts;
}

function filter(pattern) {
	return es.map(function (files, cb) {
		cb(null, micromatch(files, pattern));
	});
}

module.exports = function (pattern, options) {
	var resultStream = through.obj();
	var vinyl = through.obj(function (files, enc, cb) {
		vfs.src(files, options).pipe(resultStream);
		cb();
	});


	var gitDiff = spawn('git', ['diff', '--cached','--name-only']);

	gitDiff.stdout
		.pipe(es.split())
		.pipe(accum())
		.pipe(filter(pattern))
		.pipe(vinyl);

	return resultStream;
};
