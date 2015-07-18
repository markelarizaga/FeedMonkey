angular.module('TinyRSS').
controller('Login', ['$scope', 'sectionNavigator', 'authenticationService', 'settingsService',
function ($scope, sectionNavigator, authenticationService, settingsService) {
	
	$scope.attemptLogin = function() {
		var login = null;
		if ($scope.username && $scope.password && $scope.server_url) {
			settingsService.setCredentials($scope.server_url, $scope.username, $scope.password);
			login = authenticationService.login($scope.server_url, $scope.username, $scope.password);
			login.then(function(){
				sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES);
			}, function(error) {
				alert("Something went wrong when authenticating: " + error);
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