angular.module('TinyRSS').
factory("settingsService", function(){

	var version = "0.2.0";

	function getVersion() {
		return version;
	}

	return {
		getVersion: getVersion
	}
});