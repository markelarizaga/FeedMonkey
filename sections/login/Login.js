function Login($scope, $rootScope, backendService, sectionNavigator) {

	console.log('Login page');

	function goToMainScreen() {
		sectionNavigator.navigateTo('categories');
	}

	$scope.attemptLogin = function() {
		if ($scope.username && $scope.password && $scope.server_url) {
			backendService.authenticate($scope.username, $scope.password, $scope.server_url, goToMainScreen);
		}
	};

	if ($rootScope.loggedUser) {
		goToMainScreen();
	}
}