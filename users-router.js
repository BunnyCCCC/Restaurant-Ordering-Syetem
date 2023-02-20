
/************************************************************/
/* This is server side user-router.js file                  */
/* which sets up the router of user related get,put request */
/************************************************************/

const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const User = require("./user-schema");
const express = require('express');
let router = express.Router();
//the get and put request
router.get("/", queryParser);
router.get("/", loadUsers);
router.get("/", respondUsers);
router.get("/:uid", sendSingleUser);
router.put("/:uid", express.json(), saveUser);

//Load a user based on uid parameter
router.param("uid", function(req, res, next, value){
	let oid;
	console.log("Finding user by ID: " + value);
	try{
		oid = new ObjectId(value);
	}catch(err){
		res.status(404).send("User ID " + value + " does not exist.");
		return;
	}

	User.findById(value, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading user.");
			return;
		}

		if(!result){
			res.status(404).send("User ID " + value + " does not exist.");
			return;
			//check if the user is viewing it's own file or the user file is public
		}else if((result.username===req.session.username && req.session.loggedin==true)||result.privacy==false){
			console.log("Result:");
			console.log(result);
			req.user = result;
			//find all orders for that user
			result.findOrders(function(err, result){
				if(err){
					console.log(err);

					next();
					return;
				}

				req.user.orders = result;
				console.log("orders are: \n"+req.user.orders);

				next();
			});
		}else{
			res.status(403).send("OOPS! You are not authorized to view "+result.username+"'s profile!");
			return;
		}

	});
});

//Save the mode change to a user that are given in request body
function saveUser(req, res, next){
	//delete req.body._id;
	req.user = Object.assign(req.user, req.body);
	req.user.save(function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error updating user.");
			return;
		}
		res.status(200).send(JSON.stringify(result));
	});
}


//parse the query parameters to find the name string in user names to be considered a match
function queryParser(req, res, next){
	//build the query
	let params = [];
	for(prop in req.query){
		if(prop == "page"){
			continue;
		}
		params.push(prop + "=" + req.query[prop]);
	}
	req.qstring = params.join("&");

	if(!req.query.name){
		req.query.name = "?";
	}
	next();
}

//loads the correct set of users based on the query parameters to res.users and
//send back using respondUsers.
function loadUsers(req, res, next){

	User.find()
	.where("username").regex(new RegExp(".*" + req.query.name + ".*", "i"))
	.exec(function(err, results){
		if(err){
			res.status(500).send("Error reading users.");
			console.log(err);
			return;
		}
		res.users = results;
		next();
		return;
	});
}

//send a response using res.users along with authetication
function respondUsers(req, res, next){

	res.format({
		"text/html": () => {res.render("pages/users", {users: res.users, qstring: req.qstring, auth:req.session.loggedin, u:req.session.username, uid:req.session.uid} )},
		"application/json": () => {res.status(200).json(res.users)}
	});
	next();
}

//send the single user along with authetication
function sendSingleUser(req, res, next){
	res.format({
		"application/json": function(){
			res.status(200).json(req.user);
		},
		"text/html": () => {
			res.render("pages/user", {order: req.user.orders,user: req.user, auth:req.session.loggedin, u:req.session.username, uid:req.session.uid}); }
	});

	next();
}

//Export the router object to mounted in the server.js
module.exports = router;
