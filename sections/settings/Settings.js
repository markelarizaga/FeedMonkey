angular.module('TinyRSS').
controller('Settings', [
	'$scope',
	'$rootScope',
	'sectionNavigator',
	'authenticationService',
	'settingsService',
	'networkStatusService',
	'$translate',
	'$filter',
	'feedsCache',
function($scope,
		$rootScope,
		sectionNavigator,
		authenticationService,
		settingsService,
		networkStatusService,
		$translate,
		$filter,
		feedsCache) {

	$scope.currentPage = "settings-view";
	$scope.version = settingsService.getVersion();
	$scope.currentLanguage = settingsService.getCurrentLanguage();
	$scope.switchLanguage = false;

	$scope.logout = function () {
		var logout = authenticationService.logout();
		if(logout) {
			logout.then(function(){
					console.log("Sucessfully logged out");
				}, function(error) {
					console.log("Something went wrong when logging out: " + error);
				});
		}
		feedsCache.clear();
		sectionNavigator.clearHistory();
		if(networkStatusService.isOfflineMode()){
			networkStatusService.setOfflineMode(false);
			$rootScope.$broadcast('offlineModeChanged');
		}
		sectionNavigator.navigateTo(sectionNavigator.section.LOGIN, true, true, true);
	};

	$scope.revealLanguageSwitcher = function() {
		$scope.switchLanguage = true;
	};

	$scope.dismissLanguageSwitcher = function() {
		$scope.switchLanguage = false;
	};

	$scope.changeLanguage = function(languageCode) {
		settingsService.setCurrentLanguage(languageCode);
		$scope.currentLanguage = languageCode;
		$scope.switchLanguage = false;
	};

	$scope.restoreDefaultSettings = function() {
		if(confirm($filter('translate')('confirmResetSettings'))) {
			settingsService.restoreDefaults();
			$scope.currentLanguage = settingsService.getCurrentLanguage();
		}
	};
}]);
