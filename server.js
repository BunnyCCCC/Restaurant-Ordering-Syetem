
/********************************/
/* This is server side js file  */
/********************************/

const express = require('express');
const app = express();
const mongoose  = require("mongoose");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
//use of express sessions
const store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/tokens',
  collection: 'sessions'
});
app.use(session({
  secret: 'topsecret',
  store: store,
  resave: false,
  saveUninitialized: false }));
//use pug template engine
app.set("view engine", "pug");
app.use(express.urlencoded({extended: true}));

//set the template engine to be pug, set various routers
app.set("view engine", "pug");
let usersRouter = require("./users-router");
app.use("/users", usersRouter);
let registerRouter = require("./register-router");
app.use("/register", registerRouter);
let orderRouter = require("./order-router");
app.use("/orders",orderRouter);

//Variable to store reference to database
let db;

//get requests for homepages and images
app.get("/add.jpg", (req, res, next)=> { res.sendFile('./images/add.jpg',{ root: __dirname}); });
app.get("/remove.jpg", (req, res, next)=> { res.sendFile('./images/remove.jpg',{ root: __dirname}); });
app.get("/", (req, res, next)=> { res.render("pages/index",{auth:req.session.loggedin,uid:req.session.uid}) });
app.get('/images/*', (req, res, path)=>{res.sendFile('./images/menubackground.jpg',{ root: __dirname});});


//the login function to set session of loggedin as true and recorded username and userid
app.post("/login", function(req, res, next){
	if(req.session.loggedin){
		res.redirect("/");
		return;
	}
	console.log(req.body);

	let username = req.body.username;
	let password = req.body.password;
	mongoose.connection.db.collection("users").findOne({username: username}, function(err, result){
		if(err)throw err;
		//if the authetication is successfully
		if(result){
			if(result.password == password){
				req.session.loggedin = true;
				req.session.username = username;
				req.session.uid = result._id.toString();
				console.log("Username: " + username);
				console.log(result);
				res.render("pages/index",{auth:req.session.loggedin,uid:req.session.uid});
			}else{
				req.session.loggedin = false;
				res.status(401).send("Not authorized. Invalid password.");
				return;
			}
		}else{
			req.session.loggedin = false;
			res.status(401).send("Not authorized. Invalid username.");
			return;
		}
	});
});

//the logout function to logout user and set his/her session to loggedin=false
app.get("/logout", function(req, res, next){
	req.session.loggedin = false;
	res.redirect("/");
})


//Connect to database a4 which was initialized from database-initializer.js
mongoose.connect("mongodb://127.0.0.1/myorderingsystem", { useUnifiedTopology: true }, function(err, client) {
	if (err) {
		console.log("Error in connecting to database");
		console.log(err);
		return;
	}

	//Get the database and save it to a variable
	db = mongoose.connection;

	app.listen(3000);
	console.log("Server listening on port 3000");
});
