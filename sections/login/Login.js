angular.module('TinyRSS').
controller('Login', ['$scope',
	'sectionNavigator',
	'authenticationService',
	'settingsService',
	'$filter',
	'backgroundActivityService',
	'feedsCache',
	'$routeParams',
function ($scope,
		sectionNavigator,
		authenticationService,
		settingsService,
		$filter,
		backgroundActivityService,
		feedsCache,
		$routeParams) {

	$scope.attemptLogin = function(isAutoLogin) {
		var login = null;
		if (credentialsPresent()) {
			backgroundActivityService.notifyBackgroundActivity();
			settingsService.setCredentials($scope.serverUrl, $scope.username, $scope.password);
			login = authenticationService.login($scope.serverUrl, $scope.username, $scope.password);
			login.then(function(){
				backgroundActivityService.notifyBackgroundActivityStopped();
				sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES);
			}, function(error) {
				if(!isAutoLogin) {
					backgroundActivityService.notifyBackgroundActivityStopped();
					var errorMessage = $filter('translate')('loginError');
					var errorMessage = error ? errorMessage + ': ' + $filter('translate')(error) : errorMessage;
					alert(errorMessage);
				} else {
					// Check if the cache contains elements
					if(feedsCache.getElements()) {
						sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES);
					}
				}
			});
		}
		updateInputErrorState($scope.serverUrl, $scope.username, $scope.password);
	};

	fillCredentialsInputs();
	if($routeParams.disableAutoLogin !== 'true' && credentialsPresent()) {
		$scope.attemptLogin(true);
	}

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

	function fillCredentialsInputs() {
		var credentials = settingsService.getCredentials();
		if(credentials) {
			$scope.username = credentials.userName || '';
			$scope.password = credentials.password || '';
			$scope.serverUrl = credentials.serverUrl || '';;
		}
	}

	function credentialsPresent() {
		return ($scope.username && $scope.password && $scope.serverUrl);
	}
}]);
