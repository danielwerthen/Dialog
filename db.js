var mongoose = require('mongoose')
	, options = { auto_reconnect: true, native_parser: true }
	, connection = mongoose.createConnection('mongodb://heroku:Pass09Word@staff.mongohq.com:10046/app3931072' || process.env.DB_CONNECTION, options);

module.exports = connection;
