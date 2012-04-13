var express = require('express')
	, app = express.createServer()
	, port = process.env.PORT || 3001
	, db = require('./db')

app.configure(function () {
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger({ format: ':method :url' }));
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views');
	app.set('view options', { layout: false });
});

app.get('/', function (req, res) {
	return res.render('home');
});

app.get('/new', function (req, res) {
	return res.render('index');
});

app.post('/dialog', function (req, res) {
	console.dir(req.body);
	return res.redirect('home');
});

db.on('open', function (err) {
	console.log('DB connection attached');
	app.listen(port, function () {
		console.log('listening to port ' + port);
	});
});

db.on('error', function (err) {
	console.dir(err);
});
