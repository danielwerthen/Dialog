var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, db = mongoose.connection

var ReactionSchema = new Schema({
	ip 					: { type: String }
	, dialogId 	: { type: String }
	, reaction 	: { type: String, required: true }
});

ReactionSchema.path('reaction').validate(function (v) {
	return v.length < 20;
});

ReactionSchema.index({ ip: 1, dialogId: 1, reaction: 1 }, { unique: true });

var Reaction = db.model('Reaction', ReactionSchema);

module.exports.Reaction = Reaction;

module.exports.registerReaction = registerReaction;
function registerReaction(ip, dialogId, reaction, cb) {
	var ve = new Reaction({
		ip: ip
		, dialogId: dialogId
		, reaction: reaction
	});
	ve.save(cb);
}

module.exports.getReactions = getReactions;
function getReactions(dialogId, cb) {
	Reaction.find()
		.where('dialogId', dialogId)
		.select('ip', 'reaction')
		.run(cb);
}
