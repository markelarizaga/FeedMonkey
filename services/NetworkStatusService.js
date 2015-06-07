angular.module('TinyRSS')
.factory("networkStatusService", function(){

	var offlineMode = false;

	function isOnline() {
		return (!offlineMode && navigator.onLine);
	}

	function setOfflineMode(offline) {
		offlineMode = offline;
	}

	function isOfflineMode() {
		return offlineMode;
	}

	return{
		isOnline: isOnline,
		setOfflineMode: setOfflineMode,
		isOfflineMode: isOfflineMode
	}
})