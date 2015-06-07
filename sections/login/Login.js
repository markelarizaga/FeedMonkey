angular.module('TinyRSS').
controller('Login', ['$scope', 'sectionNavigator', 'authenticationService',
function ($scope, sectionNavigator, authenticationService) {
	
	$scope.attemptLogin = function() {
		var login = null;
		if ($scope.username && $scope.password && $scope.server_url) {
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