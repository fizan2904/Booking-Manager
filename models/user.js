var mongoose = require('mongoose'),
	bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	username : {
		type : String,
		required : true
	},
	firstname : {
		type : String,
		required : true
	},
	lastname : String,
	email : {
		type : String,
		required : true
	},
	password : {
		type : String,
		required : true
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, cb) => {
	bcrypt.genSalt(10, (err, salt) => {
		if(err) throw err;
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			newUser.password = hash;
			newUser.save(cb);
		});
	});
}

module.exports.comparePassword = (candidatePassword, hash, cb) =>{
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if(err) throw err;
		cb(null, isMatch);
	});
}

module.exports.getUserByUsername = (username, cb) => {
	User.findOne({ username : username }, cb);
}

module.exports.getUserById = (id, cb) => {
	User.findById(id, cb);
}