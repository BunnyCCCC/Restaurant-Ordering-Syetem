
/**********************************************************************/
/* This is server side restaurant-schema.js file  		                */
/* which sets up Schema of collection orders in db myorderingsystem   */
/**********************************************************************/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let restaurantSchema = Schema({
	name: {
		type: String,
		required: true,
	},
  id:{
		type: Number,
    required: true,
	},
	min_order: {
		type: Number,
		required: true
	},
	delivery_fee: {
		type: Number,
  },
	menu: mongoose.Mixed
});


//export the module to allow server.js to create new restaurant()
module.exports = mongoose.model("Restaurant", restaurantSchema);
