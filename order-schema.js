
/*************************************************************************/
/* This is server side order-schema.js file  		                         */
/* which sets up Schema of collection orders in db myorderingsystem      */
/*************************************************************************/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let orderSchema = Schema({
	uid:{
		type: Schema.Types.ObjectId, ref: 'User'//order refer to an user.
	},
	username:{
		type: String
	},
	resID: {
		type: Number,
		required: true,
	},
	resName: {
		type: String,
		required: true
	},
	subtotal: {
		type: Number,
		required: true,
  },
	total: {
		type: Number
	},
  fee:{
    type: Number
  },
  tax:{
    type:Number
  },
  order:mongoose.Mixed
});


//export the module to allow server.js to create new order()
module.exports = mongoose.model("Order", orderSchema);
