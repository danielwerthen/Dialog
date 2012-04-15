var express = require('express')
	, app = express.createServer()
	, port = process.env.PORT || 3001
	, db = require('./db').connect()
	, dialogs = require('./server/dialogs')
	, jadeHelp = require('./lib/jadeHelp')
	, barrier = require('./lib/barrier')
	, pageviews = require('./server/pageviews')

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

function hasVoted(ip, dialog, complete) {
	pageviews.hasVoted(ip, dialog._id, function (err, chars) {
		for (var c in chars) {
			dialog.characters[chars[c].charId].hasVoted = true;
		}
		complete();
	});
}

app.get('/', function (req, res) {
	dialogs.Dialog.find()
	.sort('date', -1)
	.limit(10)
	.run(function (err, list) {
		var complete = new barrier(list.length, function () {
			res.render('home', { dialogs: list });
		});
		for (var i in list) {
			var self = i;
			hasVoted(req.connection.address().address, list[i], complete);
		}
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

app.post('/vote/:id/:charId', function (req, res) {
	pageviews.registerVote(req.connection.address().address, req.params.id, req.params.charId, function (err) {
		if (err) {
			res.writeHeader(200, { 'Content-Type': 'application/JSON' });
			return res.end(JSON.stringify({ result: false }));
		}
		dialogs.upVote(req.params.id, req.params.charId, function (err) {
			res.writeHeader(200, { 'Content-Type': 'application/JSON' });
			res.end(JSON.stringify({ result: !err }));
		});
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
