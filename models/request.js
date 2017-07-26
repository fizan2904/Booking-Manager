var mongoose = require('mongoose');

var RequestSchema = mongoose.Schema({
	firstname : {
		type : String,
		required : true
	},
	lastname : {
		type : String,
		required : true
	},
	email : {
		type : String,
		required : true
	},
	audit_name : {
		type : String,
		required : true
	},
	required_from : {
		from_date : {
			type : String,
			required : true
		},
		from_time : {
			type : String,
			required : true
		}
	},
	required_to : {
		to_date : {
			type : String,
			required : true
		},
		to_time : {
			type : String,
			required : true
		}
	},
	reason : {
		type : String,
		required : true
	},
	status : {
		type : Number,
		default : 0
	}
});

var Request = module.exports = mongoose.model('Request', RequestSchema);

module.exports.createRequest = (newRequest, cb) => {
	newRequest.save(cb);
}

module.exports.removeRequest = (id, cb) => {
	Request.findOneAndUpdate({ _id : id }, { $set : { status : 2 }}, cb);
}

module.exports.allRequests = (cb) => {
	Request.find({}, cb);
}

module.exports.findRequestById = (id, cb) => {
	Request.findById(id, cb);
}

module.exports.updateRequest = (id, cb) => {
	Request.findOneAndUpdate({ _id : id }, { $set : { status : 1 }}, cb);
}