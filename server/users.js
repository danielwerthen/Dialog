var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, db = mongoose.connection

var UserSchema = new Schema({
	email : { type: String
					, required: true
					, unique: true
				 	, validate: /.*@.*/	}
});

var User = db.model('User', UserSchema);

module.exports.User = User;

module.exports.find = function (email, cb) {
	User.findOne({ email: email }, cb);
};

module.exports.create = function (email, cb) {
	var u = new User();
	u.email = email;
	u.save(cb);
}
