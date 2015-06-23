angular.module('TinyRSS').
controller('Settings', ['$scope', 'sectionNavigator', 'authenticationService', 'settingsService',
function($scope, sectionNavigator, authenticationService, settingsService) {

	$scope.version = settingsService.getVersion();

	$scope.logout = function () {
		var logout = authenticationService.logout();
		logout.then(function(){
				sectionNavigator.clearHistory();
				sectionNavigator.navigateTo(sectionNavigator.section.LOGIN, null, true, true);
			}, function(error) {
				alert("Something went wrong when logging out: " + error);
			});
	};
}]);