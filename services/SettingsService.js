angular.module('TinyRSS').
factory("settingsService", ['$translate', function($translate) {

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

	function getCurrentLanguage() {
		return $translate.use();
	}

	return {
		getVersion: getVersion,
		setCredentials: setCredentials,
		getCredentials: getCredentials,
		getCurrentLanguage: getCurrentLanguage
	}
}]);
