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
				'no error': function (err, dialog) {
					assert.isNull(err);
				}
			}
		})
		.export(module)
		.run(function (result) {
			con.close();
		});
	});
});
