var vows = require('vows')
	, assert = require('assert')
	, db = require('../db')
	, con = db.connect('TEST')
	, pageviews = require('../server/pageviews')

var suite = vows.describe('voteregistration');
con.on('open', function (err) {
	db.clearCollection('voteentries', function (err) {
		suite.addBatch({
			'Vote registration': {
				topic: function () {
								 pageviews.registerVote('ip1', 'dialog1', 0, this.callback);
							 },
				'Should pass': function (err, vote) {
					assert.isTrue(!err);
				}
			}
		}).addBatch({
			'Vote registration2': {
				topic: function () {
								 pageviews.registerVote('ip1', 'dialog1', 0, this.callback);
							 },
				'Should fail': function (err, vote) {
					assert.isFalse(!err);
				}
			}
		})
		.run(function (result) {
			con.close();
		});
	});
});
