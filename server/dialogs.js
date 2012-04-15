var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, db = mongoose.connection

var CharacterSchema = new Schema({
	name : { type: String, required: true }
	, upVotes : { type: Number, default: 0 }
	, downVotes : { type: Number, default: 0 }
});

var Character = db.model('Character', CharacterSchema);

var DialogSchema = new Schema({
	title 				: { type: String, required: true }
	, author 			: { type: String, required: true }
	, characters 	: [CharacterSchema]
	, retorters 	: [ Number ]
	, retorts 		: [ String ]
	, date 				: { type: Date, default: Date.now }
	, active 			: { type: Boolean, default: false }
});

var Dialog = db.model('Dialog', DialogSchema);

module.exports.Dialog = Dialog;

module.exports.put = put;
function put(dialog, cb) {
	if (!dialog._id) create(dialog, cb);
	else update(dialog, cb);
}

function create(dialog, cb) {
	var d = new Dialog();
	d.title = dialog.title;
	d.author = dialog.author;
	d.characters.push({ name: dialog.character0 });
	d.characters.push({ name: dialog.character1 });
	d.retorters = dialog.retorters;
	d.retorts = dialog.retorts;
	d.validate(function (err) {
		if (err) return cb(err);
		d.save(function (err) {
			if (err) return cb(err);
			cb(null, d);
		});
	});
}

function update(dialog, cb) {
	cb("Not implemented", false);
}

module.exports.upVote = upVote;
function upVote(dialogId, charId, cb) {
	Dialog.findOne({ _id: dialogId }, function (err, d) {
		if (err) return cb(err);
		d.characters[charId].upVotes++;
		d.save(function (err) {
			if (err) return cb(err);
			cb(null);
		});
	});
}
