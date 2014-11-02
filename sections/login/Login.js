function Login($scope, $rootScope, $location) {

	console.log('Login page');
	$scope.attemptLogin = function() {
		if ($scope.username === $scope.password) { // test
			$rootScope.loggedUser = $scope.username;
			$location.path( "/categories" );
		}
	};

	if ($rootScope.loggedUser || true) {
		$location.path( "/categories" );
	}
}