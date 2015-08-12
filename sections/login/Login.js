angular.module('TinyRSS').
controller('Login', ['$scope', 'sectionNavigator', 'authenticationService', 'settingsService', '$filter', 'backgroundActivityService',
function ($scope, sectionNavigator, authenticationService, settingsService, $filter, backgroundActivityService) {

	$scope.attemptLogin = function() {
		var login = null;
		if ($scope.username && $scope.password && $scope.server_url) {
			backgroundActivityService.notifyBackgroundActivity();
			settingsService.setCredentials($scope.server_url, $scope.username, $scope.password);
			login = authenticationService.login($scope.server_url, $scope.username, $scope.password);
			login.then(function(){
				backgroundActivityService.notifyBackgroundActivityStopped();
				sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES);
			}, function(error) {
				backgroundActivityService.notifyBackgroundActivityStopped();
				var errorMessage = $filter('translate')('loginError');
				var errorMessage = error ? errorMessage + ': ' + $filter('translate')(error) : errorMessage;
				alert(errorMessage);
			});
		}
	};

	var loggedIn = authenticationService.isLoggedIn();
	if (loggedIn) {
		loggedIn.then(function() {
			sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES);
		});
	}
}]);
