/******************************************************/
/* This is client side js file for add new user       */
/******************************************************/


//onload function
function init(){
	document.getElementById("register").onclick = submitNewUser;
}


//function to submit new user
function submitNewUser(){
	let name = document.getElementById("username").value;
	let passwd = document.getElementById("password").value;

	if(name.length > 0 && passwd.length > 0){
		let newuser = {"username":name,"password":passwd,"privacy":false};


		let req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200){
				alert("User "+name+" added!");
				console.log("All good. " + this.responseText);
				let id = JSON.parse(this.responseText).uid;
				//redirected to the new user's page
				window.location.href = "http://127.0.0.1:3000/users/" + id;
			}else if(this.readyState ==4 && this.status == 422){
				//if the username is already exist
				alert("username "+name+" existed! Please choose a new username!");
				document.getElementById("username").value= "";
				document.getElementById("password").value= "";
			}

		}
		req.open("POST", "http://127.0.0.1:3000/register");
		req.setRequestHeader("Content-type","application/json");
		req.send(JSON.stringify(newuser));
		console.log(newuser);

	}else{
		alert("You have to enter username and password!");
	}

}
