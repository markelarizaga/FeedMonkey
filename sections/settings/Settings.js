angular.module('TinyRSS').
controller('Settings', ['$scope', 'sectionNavigator', 'authenticationService', 'settingsService', '$translate',
function($scope, sectionNavigator, authenticationService, settingsService, $translate) {

	$scope.version = settingsService.getVersion();
	$scope.currentLanguage = settingsService.getCurrentLanguage();
	$scope.switchLanguage = false;

	$scope.logout = function () {
		var logout = authenticationService.logout();
		logout.then(function(){
				sectionNavigator.clearHistory();
				sectionNavigator.navigateTo(sectionNavigator.section.LOGIN, null, true, true);
			}, function(error) {
				alert("Something went wrong when logging out: " + error);
			});
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
	}
}]);
