var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, db = mongoose.connection
	, users = require('./users')

var CharacterSchema = new Schema({
	name : { type: String, required: true }
	, upVotes : { type: Number, default: 0 }
	, downVotes : { type: Number, default: 0 }
});

var Character = db.model('Character', CharacterSchema);

var DialogSchema = new Schema({
	title 				: { type: String, required: true }
	, author 			: { type: String, required: true }
	, parent 			: { type: Schema.ObjectId, ref: 'Dialog' }
	, user 				: { type: Schema.ObjectId, ref: 'User' }
	, characters 	: [CharacterSchema]
	, retorters 	: [ Number ]
	, retorts 		: [ String ]
	, date 				: { type: Date, default: Date.now, index: true }
	, active 			: { type: Boolean, default: false }
	, totalReactions : { type: Number, index: true }
	, topReactions : [ String ]
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
	if (dialog.parentId)
		d.parent = dialog.parentId;
	d.characters.push({ name: dialog.character0 });
	d.characters.push({ name: dialog.character1 });
	if (!dialog.retorts || !dialog.retorters
			|| dialog.retorts.length == 0
			|| dialog.retorts.length == 0)
		return cb("You need to write something before sharing");
	d.retorters = dialog.retorters;
	d.retorts = dialog.retorts;
	var finish = function () {
		d.validate(function (err) {
			if (err) return cb(err);
			d.save(function (err) {
				if (err) return cb(err);
				cb(null, d);
			});
		});
	}
	if (dialog.email) {
		users.find(dialog.email, function (err, user) {
			if (err) { 
				console.log('err'); 
				return cb(err);
			}
			else if (!user) {
				console.log('create user');
				return users.create(dialog.email, function (err, user) {
					if (err) { 
						console.log('err creating user');
						return cb(err); 
					}
					console.log('attaching user to dialog');
					d.user = user._id;
					return finish();
				});
			}
			console.log('found user');
			d.user = user._id;
			return finish();
		});
	}
	else {
		finish();
	}
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
