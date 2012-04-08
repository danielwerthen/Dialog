var express = require('express')
	, app = express.createServer()
	, port = process.env.PORT || 3001

app.configure(function () {
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger({ format: ':method :url' }));
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views');
});

app.get('/', function (req, res) {
	return res.render('index');
});

app.listen(port, function () {
	console.log('listening to port ' + port);
});
