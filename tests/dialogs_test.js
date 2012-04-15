var vows = require('vows')
	, assert = require('assert')
	, db = require('../db')
	, con = db.connect('TEST')
	, dialogs = require('../server/dialogs')

var testDialog1 = {
	title: 'Grand discuss'
	, author: 'Daniel'
	, character0: 'Jesus'
	, character1: 'Isaac'
	, retorters: [ '0', '1', '0' ]
	, retorts: [ 'I dont think that is funny', 'Why?', 'It just isn\'t!' ]
};

var suite = vows.describe('dialogs');
con.on('open', function (err) {
	db.clearCollection('dialogs', function (err) {
		suite.addBatch({
			'Dialog creation1': {
				topic: function () {
					dialogs.put(testDialog1, this.callback);
				},
				'test upvote': {
					topic: function (dialog) {
									 dialogs.upVote(dialog._id, 0, this.callback);
								 },
					'check vote stat': function (err) {
						assert.isTrue(!err);
					},
				'check upvote': {
					topic: function (dialog) {
									 dialogs.Dialog.findOne({ _id: dialog._id }, this.callback);
								 },
					'make sure upvote = 1': function (err, dialog) {
						assert.isTrue(dialog.characters[0].upVotes == 1);
					}
				}
				},
			}
		})
		.run(function (result) {
			con.close();
		});
	});
});
