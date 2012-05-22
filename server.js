var express = require('express')
	, _ = require('underscore')
	, app = express.createServer()
	, port = process.env.PORT || 3000
	, db = require('./db').connect(process.env.DB || 'X')
	, dialogs = require('./server/dialogs')
	, jadeHelp = require('./lib/jadeHelp')
	, barrier = require('./lib/barrier')
	, pageviews = require('./server/pageviews')
	, worker = require('./worker')
	, queues = require('./server/workerQueues')

if (!process.env.divideWorkers) {
	worker.start();
}

app.configure(function () {
	app.use(express.favicon());
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger({ format: ':method :url' }));
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views');
	app.set('view options', { layout: false });
	jadeHelp.set('views', __dirname + '/views');
});

app.helpers({
	_: _
});

app.dynamicHelpers({
	req: function(req) {
				 return req;
			 }
});

function getReactions(ip, dialog, complete) {
	pageviews.getReactions(dialog._id, function (err, reactions) {
		if (err) return complete(err);
		grouped = _.chain(reactions)
			.groupBy(function (r) { return r.reaction; })
			.map(function (g) {
				return { reaction: g[0].reaction, count: g.length, clicked: _.any(g, function (r) {
					return r.ip === ip;
				}) }; 
			})
			.sortBy(function (r) { return -r.count; })
			.value();
		dialog._reactions = grouped;
		complete(null, dialog);
	});
}

function listDialogs(req, res, sorting) {
	dialogs.Dialog.find()
	.sort(sorting, -1)
	.limit(10)
	.populate('parent', ['title'])
	.run(function (err, list) {
		var complete = new barrier(list.length, function () {
			res.render('index', { dialogs: list });
		});
		if (list.length == 0)
			complete();
		for (var i in list) {
			var self = i
				, con = req.connection ? req.connection.address() : undefined
				, address = con ? con.address : ""

			getReactions(address, list[i], complete);
		}
	});
}

app.get('/', function (req, res) {
	listDialogs(req, res, 'totalReactions');
});

app.get('/new', function (req, res) {
	listDialogs(req, res, 'date');
});

app.get('/byId/:id', function (req, res) {
	dialogs.Dialog.findOne({ _id: req.params.id })
	.populate('parent', ['title'])
	.run(function (err, doc) {
		if (err) return res.render('error', { error: err });
		var con = req.connection ? req.connection.address() : undefined
			, address = con ? con.address : "";
		getReactions(address, doc, function (err, doc) {
			if (err) return res.render('error', { error: err });
			return res.render('byId', { dialog: doc });
		});
	});
});

app.get('/write/:id?', function (req, res) {
	if (req.params.id) {
		dialogs.Dialog.findOne({ _id: req.params.id }, function (err, doc) {
			if (err) return res.render('error', { error: err });
			return res.render('write', { parent: doc });
		});
	}
	else {
		return res.render('write');
	}
});

app.post('/dialog', function (req, res) {
	dialogs.put(req.body, function (err, result) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		if (err || !result) return res.end(JSON.stringify({ error: err }));
		return res.end(JSON.stringify({ success: true }));
	});
});

app.post('/vote/:id', function (req, res) {
	pageviews.registerReaction(req.connection.address().address, req.params.id, req.body.reaction, function (err) {
		if (err) {
			res.writeHeader(200, { 'Content-Type': 'application/JSON' });
			return res.end(JSON.stringify({ result: false }));
		}
		else {
			res.writeHeader(200, { 'Content-Type': 'application/JSON' });
			return res.end(JSON.stringify({ result: true }));
		}
	});
	queues.addWorkItem(req.params.id);
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
