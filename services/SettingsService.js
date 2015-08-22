angular.module('TinyRSS').
factory("settingsService", ['$translate', 'localStorageService', function($translate, localStorageService) {

	var version = "0.3.5";
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
		localStorageService.set('url', serverUrl);
		localStorageService.set('user', username);
		localStorageService.set('pass', password);
	}

	function getCredentials() {
		url = url || localStorageService.get('url');
		user = user || localStorageService.get('user');
		pass = pass || localStorageService.get('pass');

		return (url && user && pass) ?  {
			serverUrl: url,
			serverApiUrl: url + '/api/',
			userName: user,
			password: pass
		} : null;
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

	function markArticleHelpAsShown() {
		return localStorageService.set('articleHelpShown', true);
	}

	function isArticleHelpShown() {
		return localStorageService.get('articleHelpShown') === 'true';
	}

	function restoreDefaults() {
		// Set english as the current language
		$translate.use('en');
		// Mark the articles help message as not shown
		localStorageService.set('articleHelpShown', false);
		// Remove the stored credentials
		localStorageService.remove('url');
		localStorageService.remove('user');
		localStorageService.remove('pass');
	}

	return {
		getVersion: getVersion,
		setCredentials: setCredentials,
		getCredentials: getCredentials,
		getCurrentLanguage: getCurrentLanguage,
		setCurrentLanguage: setCurrentLanguage,
		getLanguagePreference: getLanguagePreference,
		markArticleHelpAsShown: markArticleHelpAsShown,
		isArticleHelpShown: isArticleHelpShown,
		restoreDefaults: restoreDefaults
	}
}]);
