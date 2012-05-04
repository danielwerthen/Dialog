var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, db = mongoose.connection

var ReactionToDialogSchema = new Schema({
	dialogId : { type: Schema.ObjectId, unique: true }
});

var ReactionToDialog = db.model('ReactionToDialog', ReactionToDialogSchema);

module.exports.ReactionToDialog = ReactionToDialog;

module.exports.addWorkItem = function (dialogId) {
	var item = new ReactionToDialog({ dialogId: dialogId });
	item.save();
}
