angular.module('TinyRSS')
.factory("authenticationService", ['$q', 'http', function($q, http){
	
  var token = null;
	var serverUrl = null;
	
	/**
	 * This function makes an asynchronous call to the server sending the user credentials to authenticate. The function returns a 
	 * promise that will call the resolve callback in case of success of the reject callback in case of failure.
	 * @method login
	 * @example
	 * var promise = authenticationService.login($scope.server_url, $scope.username, $scope.password);
	 * promise.then(successCallback, failureCallback);
	 * @param server_url
	 * @param user Username of the profile that will be used to authenticate with the server
	 * @param password Password of the profile that will be used to authenticate with the server
	 * @return {Object} A promise object that will call either a resolve (sucess) or reject (fail) function when result is ready
	 **/
	function login(server_url, user, password) {
		var deferred = $q.defer();
		var options = {op: "login", user: user, password: password};
		serverUrl = server_url + "/api/";
		
		http.post(serverUrl, options,
			function(xhr) {
				if(JSON.parse(xhr.responseText).content.error) {
							deferred.reject(JSON.parse(xhr.responseText).content.error);
						} else if (JSON.parse(xhr.responseText).content.session_id) {
							token = JSON.parse(xhr.responseText).content.session_id;
							deferred.resolve();
						}
			}, function(xhr) {
				deferred.reject(xhr.statusText);
			}
		);

		return deferred.promise;
	}
	
	/**
	 * Asynchronously checks for authentication status. This function will check for a token and a serverUrl stored in memory and if 
	 * both elements are present will return a promise that will call resolve callback if user is logged in and reject in other case.
	 * If no token and server url are present, this function will return null.
	 * @method isLoggedIn
	 * @example
	 * var promise = authenticationService.isLoggedIn();
	 * if (promise) {promise.then(isLoggedCallback, failureCallback);}
	 * @return {Object} A promise that will call resolve callback if user is logged in and reject in other case or null if no token 
	 * and server url exist in memory
	 **/
	function isLoggedIn() {
		
		var deferred = $q.defer();
		var options = {op: "isLoggedIn", sid: token};
		var returnValue = null;
		
		if(token && serverUrl) {
			http.post(serverUrl, options,
				function(xhr) {
					if(JSON.parse(xhr.responseText).content.status) {
								deferred.resolve();
							} else {
								token = null;
								deferred.reject();
							}
				}, function(xhr) {
					deferred.reject(xhr.statusText);
				}
			);
			returnValue = deferred.promise;
		}

		return returnValue;
	}
	
	/**
	 * Sends an asynchronous call to the server to logout the current user.
	 * @method logout
	 * @return {Object} A promise that will call resolve callback in case the log out was done (or already not logged in) 
	 * and reject if the network call fails
	 **/
	function logout() {

		var deferred = $q.defer();
		var options = {op: "logout", sid: token};
		var returnValue = null;
		
		if(token && serverUrl) {
			http.post(serverUrl, options,
				function(xhr) {
					token = null;
					deferred.resolve();
				}, function(xhr) {
					deferred.reject(xhr.statusText);
				}
			);
			returnValue = deferred.promise;
		}

		return returnValue;
	}
	
	function getToken() {
			return token;
		}


	return{
		isLoggedIn: isLoggedIn,
		login: login,
		logout: logout,
		getToken: getToken
	};
}])