var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, db = mongoose.connection

var VoteEntrySchema = new Schema({
	ip 					: { type: String }
	, dialogId 	: { type: String }
	, charId 		: { type: Number }
});

VoteEntrySchema.index({ ip: 1, dialogId: 1, charId: 1 }, { unique: true });

var VoteEntry = db.model('VoteEntry', VoteEntrySchema);

module.exports.VoteEntry = VoteEntry;

module.exports.registerVote = registerVote;
function registerVote(ip, dialogId, charId, cb) {
	var ve = new VoteEntry({
		ip: ip
		, dialogId: dialogId
		, charId: charId
	});
	ve.save(cb);
}

module.exports.hasVoted = hasVoted;
function hasVoted(ip, dialogId, cb) {
	VoteEntry.find()
		.where('ip', ip)
		.where('dialogId', dialogId)
		.select('charId')
		.run(cb);
}
