angular.module('TinyRSS').
factory("settingsService", function(){

	var version = "0.2.1";
	var url = null;
	var user = null;
	var pass = null;

	function getVersion() {
		return version;
	}

	function setCredentials(serverUrl, username, password) {
		url = serverUrl;
		user = username;
		pass = password;
	}

	function getCredentials() {
		return {
			serverUrl: url,
			serverApiUrl: url + '/api/',
			userName: user,
			password: pass
		};
	}

	return {
		getVersion: getVersion,
		setCredentials: setCredentials,
		getCredentials: getCredentials
	}
});