angular.module('FeedMonkey').factory("backendService", function(){
	
	function login(server_url, user, password, callback) {
	
		var url = server_url + "/api/";
		var options = {op: "login", user: user, password: password};

		var xhr = new XMLHttpRequest({mozSystem: true});
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					callback(JSON.parse(xhr.responseText).content);
				} else {
					if(xhr.status == 0) {
						alert("Something went wrong, please check your credentials and the server address");
					} else {
						alert("error: " + xhr.status + " " + xhr.statusText);
					}
				}
			}
		}
		xhr.open("POST", url, true);
		xhr.send(JSON.stringify(options));
	}


	return{
		authenticate: function(user, password, server_url, callback) {

			// if(!this.onLine()) {
			// 	alert("You need to be on line to log in to your server.");
			// 	return false;
			// }

			var errs = [];
			if(!server_url || server_url.indexOf("http") != 0) errs.push("add a server url that starts with http");
			if((user && !password) || (!user && password)) errs.push("add both username and password or neither");

			if(errs.length > 0) {
				alert("Please " + errs.join(",\n") + ".");
				return false;
			} 

			login(server_url, user, password, callback);
			return false;
		}
	};
})