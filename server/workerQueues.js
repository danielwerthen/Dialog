var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, db = mongoose.connection

var ReactionToDialogSchema = new Schema({
	dialogId : { type: Schema.ObjectId }
});

var ReactionToDialog = db.model('ReactionToDialog', ReactionToDialogSchema);

module.exports.ReactionToDialog = ReactionToDialog;
