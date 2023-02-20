
/*******************************************************/
/* This is client side js file for update current user */
/*******************************************************/
let update = {};

//onlead function for update user's page
function init(){
	document.getElementById("update").onclick = sendUpdate;
}

//function to send json to server in order to update user's info
function sendUpdate(){
	let xhttp = new XMLHttpRequest();
	let userId = document.getElementById("curuser").getAttribute("value");
	let privacy = getMode();
		console.log(privacy);
		update["_id"] = userId;
		update["privacy"] = privacy;

		console.log(update);

		xhttp.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
						console.log(this.responseText);
			  }
	    };
	    xhttp.open("PUT", "http://127.0.0.1:3000/users/"+userId, true);
			xhttp.setRequestHeader("Content-type","application/json");
		xhttp.send(JSON.stringify(update));

}

function getMode(){
	let p;
	let mode = document.getElementsByName("mode");
	for(let i=0;i<mode.length;i++){
		if(mode[i].checked){
			p = mode[i].value;
			break;
		}
	}
	return p;
}
