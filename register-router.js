
/************************************************/
/* This is server side register-router.js file  */
/* which sets up the router of register process */
/************************************************/

const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const User = require("./user-schema");
const express = require('express');
let router = express.Router();


//get and post requests
router.get("/", (req, res, next)=> { res.render("pages/register"); });
router.post("/", express.json(), createUser);



//Creates a new user and check if the user name is duplicate,
//if not, we add the new user to the database.
function createUser(req, res, next){

	let u = new User();
	u.username = req.body.username;
	u.password = req.body.password;
	u.privacy = req.body.privacy;

	u.save(function(err, result){
		if(err){
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate username
        return res.status(422).send({ succes: false, message: 'User already exist!' });
      }
			console.log(err);
			res.status(500).send("Error creating user.");
			return;
		}
		//after creating the user, the user is automatically logged in.
			let session = req.session;
			session.loggedin = true;
			session.username = u.username;
			mongoose.connection.db.collection("users").findOne({username: u.username}, function(err, result){
				if(err)throw err;

				if(result){
					session.uid = result._id.toString();
					res.status(200).send(JSON.stringify(session));//send back the userid
				}
			});

	})
}


//Export the router and mounted in the server.js
module.exports = router;
