var jade = require('jade')
	, fs = require('fs')
	, settings = { views: '', ending: '.jade' }

function compileFile(filename, cb) {
	fs.readFile(filename, function (err, data) {
		if (err) cb(err);
		try {
			var fn = jade.compile(data, { filename: filename });
			cb(null, fn);
		}
		catch (err) {
			cb(err);
		}
	});
}

module.exports.set = function (setting, value) {
	settings[setting] = value;
};

module.exports.compile = function (view, cb) {
	compileFile(settings.views + '/' + view + settings.ending, cb);
}

