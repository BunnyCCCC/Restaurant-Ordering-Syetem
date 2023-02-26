
/************************************************/
/* This is server side order-router.js file     */
/* which sets up the router of submitting or    */
/* viewing orders                               */
/************************************************/

const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Order = require("./order-schema");
const User = require("./user-schema");
const Restaurant = require("./restaurant-schema");
const express = require('express');
let router = express.Router();
let restaurants;

//get and post request
router.get("/", statusCheck,loadRestaurants,loadOrderform);
router.get("/:oid", sendSingleOrder);
router.post("/", express.json(), receivedOrder);

//load an order based on oid parameters
router.param("oid", function(req, res, next, value){
	let oid;
	console.log("Finding order by ID: " + value);
	try{
		oid = new ObjectId(value);
	}catch(err){
		res.status(404).send("Order ID " + value + " does not exist.");
		return;
	}
	//find the order
	Order.findById(value, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading order.");
			return;
		}

		if(!result){
			res.status(404).send("Order ID " + value + " does not exist.");
			return;
		}else {
			//find current order's corresponding user and check their privacy and logged in status
			mongoose.connection.db.collection("users").findOne({_id: result.uid}, function(err, userRes){
			if(err)throw err;

			if(userRes.privacy==false || (userRes.username === req.session.username && req.session.loggedin)){
				console.log("Result:");
				console.log(result);
				req.order = result;

				console.log(req.order);

				next();
			}else{
				res.status(403).send("OOPS! You are not authorized to view order "+result._id);
				return;
			}

			});
		}

	});
});


//the status check if an user tries to place an order but not loggedin.
function statusCheck(req,res,next){
	if(req.session.loggedin==false){
		res.status(403).send("Please log in before placing an order! Thank you!");
	}else{
		next();
	}
}

//laod the restaurants data
function loadRestaurants(req,res,next){
	Restaurant.find({})
	.exec(function(err, results){
		if(err){
			res.status(500).send("Error reading restaurants.");
			console.log(err);
			return;
		}
		res.restaurants = results;
		//console.log(res.restaurants);
		next();
	});
}

//load the orderform to loggedin users.
function loadOrderform(req,res,next){
	res.format({
		"text/html": () => {res.render("pages/orderform",{restaurants:res.restaurants,auth:req.session.loggedin, u:req.session.username, uid:req.session.uid})},
		"application/json": () => {res.status(200).json(res.restaurants)}
	});
	next();
	return;
}


//Creates a order and add it to the database
function receivedOrder(req, res, next){
  console.log(req.body);
	//Create the new order
	let nOrder = new Order();
	nOrder.uid = req.session.uid;
	nOrder.resID = req.body.restaurantID;
	nOrder.resName = req.body.restaurantName;
	nOrder.username = req.session.username;
	nOrder.subtotal = req.body.subtotal;
	nOrder.total = req.body.total;
	nOrder.fee = req.body.fee;
	nOrder.tax = req.body.tax;
	nOrder.order = {};
	let i;
	let k = 0;
	for(let item in req.body.order){
		i = {};
		i["name"] = req.body.order[item].name;
		i["qty"] = req.body.order[item].quantity;
		nOrder.order[k]=i;
		k++;
	}
	console.log("the order recieved is: "+nOrder);
	nOrder.save(function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error saving the order.");
			return;
		}
		res.status(200).send("Order received!");
	});

}

//send the single order to order summary page with req.user and authetication info
function sendSingleOrder(req, res, next){
	res.format({
		"application/json": function(){
			res.status(200).json(req.order);
		},
		"text/html": () => { res.render("pages/order", {user: req.user, auth:req.session.loggedin, order:req.order, uid:req.session.uid}); }
	});

	next();

}



//Export the router object to mounted in server.js
module.exports = router;
