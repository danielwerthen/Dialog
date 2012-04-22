var mongoose = require('mongoose')
	, options = { auto_reconnect: true, native_parser: true }

module.exports.connect = function (dbString) {
	if (!dbString || dbString === 'production') dbString = 'mongodb://heroku:Pass09Word@staff.mongohq.com:10046/app3931072' || process.env.DB_CONNECTION;
	else if (dbString === 'TEST')
		dbString = 'mongodb://vows:Pass09Word@flame.mongohq.com:27041/Dialog_test';
	else if (dbString === 'X')
		dbString = 'mongodb://admin:Pass09Word@flame.mongohq.com:27041/Dialog_test';
	console.log(dbString);
	mongoose.connect(dbString, options);
	return mongoose.connection;
};

module.exports.clearCollection = function (name, cb) {
	mongoose.connection.db.collection(name, function (err, col) {
		if (err) return cb(err);
		col.remove(function (err) {
			cb(err);
		});
	});
};
