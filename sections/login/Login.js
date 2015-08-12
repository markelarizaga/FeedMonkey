angular.module('TinyRSS').
controller('Login', ['$scope', 'sectionNavigator', 'authenticationService', 'settingsService', '$filter', 'backgroundActivityService',
function ($scope, sectionNavigator, authenticationService, settingsService, $filter, backgroundActivityService) {

	$scope.attemptLogin = function() {
		var login = null;
		if ($scope.username && $scope.password && $scope.serverUrl) {
			backgroundActivityService.notifyBackgroundActivity();
			settingsService.setCredentials($scope.serverUrl, $scope.username, $scope.password);
			login = authenticationService.login($scope.serverUrl, $scope.username, $scope.password);
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
		updateInputErrorState($scope.serverUrl, $scope.username, $scope.password);
	};

	var loggedIn = authenticationService.isLoggedIn();
	if (loggedIn) {
		loggedIn.then(function() {
			sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES);
		});
	}

	function updateInputErrorState(serverUrl, username, password) {
		$scope.serverUrlError = !serverUrl;
		$scope.usernameError = !username;
		$scope.passwordError = !password;
	}
}]);
