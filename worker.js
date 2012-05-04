var db = require('./db').connect(process.env.DB || 'X')
	, _ = require('underscore')
	, pageviews = require('./server/pageviews')
	, dialogs = require('./server/dialogs')
	, queues = require('./server/workerQueues')

function mapReactions(dialog, cb) {
	pageviews.getReactions(dialog._id, function (err, reactions) {
		if (err) return cb(err);
		grouped = _.chain(reactions)
			.groupBy(function (r) { return r.reaction; })
			.sortBy(function (r) { return -r.length; })
			.map(function (g) {
				return g[0].reaction;
			})
			.value();
		dialog.totalReactions = reactions.length;
		dialog.topReactions = _.first(grouped, 5);
		cb(null, dialog);
	});
}

function workReactionToDialog(cb) {
	queues.ReactionToDialog.findOne({}, function (err, workItem) {
		if (err) { return cb(err); }
		if (!workItem) { return cb(err, false); }
		dialogs.Dialog.findOne({ _id: workItem.dialogId }, function (err, dialog) {
			if (err || !dialog) { return cb(err); }
			mapReactions(dialog, function (err, dialog) {
				if (err || !dialog) { return cb(err); }
				dialog.save(function (err) {
					if (err) { return cb(err); }
					queues.ReactionToDialog.remove({ _id: workItem._id }, function (err) {
						if (err) { return cb(err); }
						cb(null, true);
					});
				});
			});
		});
	});
}

var delay = 1000 * 60;
function doWork() {
	workReactionToDialog(function (err, result) {
		if (err) { console.dir(err); return setTimeout(doWork, delay); }
		else if (!result) { return setTimeout(doWork, delay); }
		else { doWork(); }
	});
}
function start() {
	console.log('Initiating worker...');
	setTimeout(function () {
		console.log('Commencing worker queue run-down');
		doWork();
	}, 1000);

	queues.ReactionToDialog.count({}, function (err, c) {
		if (err) { return console.dir(err); }
		console.log(c + ' items in queue');
		if (c === 0) {
			addAllDialogs();
		}
	});
}
if (!module) {
	start();
}
else {
	module.exports.start = start;
}

function addAllDialogs() {
	console.log('Adding all dialogs');
	var stream = dialogs.Dialog.find().stream();
	stream.on('data', function (dialog) {
		var self = this;
		self.pause();
		var item = new queues.ReactionToDialog({ dialogId: dialog._id });
		item.save(function (err) {
			if (err) { console.dir(err); }
			self.resume();
		});
	});

	stream.on('error', function (err) {
		console.dir(err);
	});

	stream.on('close', function () {
		console.log('All dialogs added');
	});
}
