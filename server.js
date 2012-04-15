var express = require('express')
	, app = express.createServer()
	, port = process.env.PORT || 3001
	, db = require('./db').connect()
	, dialogs = require('./server/dialogs')
	, jadeHelp = require('./lib/jadeHelp')

app.configure(function () {
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger({ format: ':method :url' }));
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views');
	app.set('view options', { layout: false });
	jadeHelp.set('views', __dirname + '/views');
});

app.get('/', function (req, res) {
	dialogs.Dialog.find()
	.sort('date', -1)
	.limit(10)
	.run(function (err, list) {
		res.render('home', { dialogs: list });
	});
});

app.get('/byId/:id', function (req, res) {
	dialogs.Dialog.findOne({ _id: req.params.id }, function (err, doc) {
		if (err) return res.render('error', { error: err });
		return res.render('byId', { dialog: doc });
	});
});

app.get('/new', function (req, res) {
	return res.render('index');
});

app.post('/dialog', function (req, res) {
	dialogs.put(req.body, function (err, result) {
		if (err || !result) return res.render('error', { error: err });
		return res.redirect('home');
	});
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
