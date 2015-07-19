angular.module('TinyRSS').
factory("settingsService", ['$translate', 'localStorageService', function($translate, localStorageService) {

	var version = "0.3.0";
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

	function setCurrentLanguage(languageCode) {
		$translate.use(languageCode);
		localStorageService.set('language', languageCode);
	}

	function getLanguagePreference() {
		return localStorageService.get('language');
	}

	return {
		getVersion: getVersion,
		setCredentials: setCredentials,
		getCredentials: getCredentials,
		getCurrentLanguage: getCurrentLanguage,
		setCurrentLanguage: setCurrentLanguage,
		getLanguagePreference: getLanguagePreference
	}
}]);
