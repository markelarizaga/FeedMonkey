angular.module('FeedMonkey').factory("authenticationService", function(){
	
  var user = null;
  var token = null;
  
	function login(server_url, user, password, callback) {
		var url = server_url + "/api/";
		var options = {op: "login", user: user, password: password};

		var xhr = new XMLHttpRequest({mozSystem: true});
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					token = JSON.parse(xhr.responseText).content.session_id;
					callback();
				} else {
					if(xhr.status == 0) {
						alert("Something went wrong, please check your credentials and the server address");
					} else {
						alert("error: " + xhr.status + " " + xhr.statusText);
					}
				}
			}
		};
		xhr.open("POST", url, true);
		xhr.send(JSON.stringify(options));
	}


	return{
    isLoggedIn: function () {
      
    },
    login: login,
    logout: function () {
      
    }
	};
})