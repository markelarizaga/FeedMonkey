angular.module('TinyRSS')
.factory('networkStatusService',
['localStorageService', function(localStorageService){

	var offlineMode = JSON.parse(localStorageService.get('offlineMode')) || false;

	return {
		isOnline: isOnline,
		setOfflineMode: setOfflineMode,
		isOfflineMode: isOfflineMode,
		networkConnectionExists: networkConnectionExists
	};

	/**
	 * Determines if the app is in online mode if all the needed requirements
	 * are met. These requirements are that the offline mode of the app should
	 * be disabled and the device has an actual connection to the network.
	 * @return {Boolean} True if there is an active network connection and the
	 * offline mode of the app is disabled. False in other case.
	 */
	function isOnline() {
		return (!offlineMode && navigator.onLine);
	}

	function networkConnectionExists(){
		return navigator.onLine;
	}

	/**
	 * Updates the status of the offline mode
	 * @param {Boolean} offline The new status of the offline mode
	 */
	function setOfflineMode(offline) {
		offlineMode = offline;
		localStorageService.set('offlineMode', offline);
	}

	/**
	 * Checks whether the app offline mode status is enabled or not. This function
	 * does not deal with the actual network connection of the device, just
	 * check the offline mode status of the app.
	 * @return {Boolean} True if offline mode of the app is enabled, false in
	 * other case
	 */
	function isOfflineMode() {
		return offlineMode;
	}
}]);
