function Login($scope, $rootScope, sectionNavigator, authenticationService) {

	$scope.server_url = 'http://lecturas.markelarizaga.com';
	$scope.username = 'markel';
	$scope.password = 'markel123';
	
	function goToMainScreen() {
		sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES);
	}

	$scope.attemptLogin = function() {
		if ($scope.username && $scope.password && $scope.server_url) {
			authenticationService.login($scope.server_url, $scope.username, $scope.password, goToMainScreen);
		}
	};

	if ($rootScope.loggedUser) {
		goToMainScreen();
	}
}