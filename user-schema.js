
/***********************************************************/
/* This is server side user-schema.js file  		           */
/* which sets up Schema of collection users in db a4       */
/***********************************************************/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
	username: {
		type: String,
		required: "Please enter your username",
		unique: true
	},
	password:{
			type: String,
			required: "Please enter your password"
	},
	privacy: {
			type: Boolean,
			required: true
	}
});

//Instance method finds orders's oid of this user
userSchema.methods.findOrders = function(callback){
	this.model("Order").find()
	.where("username").equals(this.username)
	.populate("_id")
	.exec(callback);
};

module.exports = mongoose.model("User", userSchema);
