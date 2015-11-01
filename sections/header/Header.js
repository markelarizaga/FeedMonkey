angular.module('TinyRSS').
controller('Header',
		['$scope',
		'sectionNavigator',
		'feedsCache',
		'backendService',
		'networkStatusService',
		'syncService',
		'$filter',
		'backgroundActivityService',
		'$rootScope',
function($scope,
		sectionNavigator,
		feedsCache,
		backendService,
		networkStatusService,
		syncService,
		$filter,
		backgroundActivityService,
		$rootScope) {

	$scope.isRoot = true;
	$scope.offline = false;
	$scope.backgroundWorkPresent = false;
	var previousHeaderStatus = null;

	sectionNavigator.addEventListener("onSectionChanged", function(newSection){
		var id = newSection.split("/");
		id = id[id.length-1];

		$scope.title = feedsCache.getElementTitle(id) || "Tiny RSS";
		$scope.isRoot = sectionNavigator.isInRoot();
		if(newSection.indexOf('settings') != -1) {
			$scope.status = 'settings';
		} else {
			$scope.status = 'default';
		}
	});

	backgroundActivityService.addEventListener('onActivityPresent', function(){
		$scope.backgroundWorkPresent = true;
	});
	backgroundActivityService.addEventListener('onActivityStopped', function(){
		$scope.backgroundWorkPresent = false;
	});

	$scope.$on('enterEditMode', function(){
		previousHeaderStatus = $scope.status;
		$scope.status = 'editMode';
	});

	$scope.$on('exitEditMode', function() {
		$scope.status = 'default';
	});

	$scope.$on('cancelEditMode', function() {
		$scope.status = 'default';
	});

	$scope.goBack = function() {
		backgroundActivityService.notifyBackgroundActivityStopped();
		sectionNavigator.back();
		$rootScope.$broadcast('backPressed');
	};

	$scope.toggleOffline = function() {
		$scope.backgroundWorkPresent = true;
		if(!networkStatusService.isOfflineMode()) {
			backendService.goOffline(function (error, feeds) {
				if(!error) {
					alert($filter('translate')('offlineModeReady'));
					$scope.offline = true;
					feedsCache.setOfflineFeeds(feeds);
					networkStatusService.setOfflineMode(true);
					sectionNavigator.navigateTo(sectionNavigator.section.ROOT_SECTION);
				} else {
					alert($filter('translate')('offlineModeError'));
				}
				$scope.backgroundWorkPresent = false;
			});
		} else {
			$scope.offline = false;
			networkStatusService.setOfflineMode(false);
			feedsCache.clear();
			syncService.syncWithServer();
			$scope.backgroundWorkPresent = false;
			sectionNavigator.navigateTo(sectionNavigator.section.ROOT_SECTION);
		}
	};

	$scope.openSettings = function() {
		backgroundActivityService.notifyBackgroundActivityStopped();
		sectionNavigator.navigateTo(sectionNavigator.section.SETTINGS);
	};

	$scope.reloadFeeds = function() {
		sectionNavigator.navigateTo(sectionNavigator.section.ROOT_SECTION);
	}

	$scope.leaveEditMode = function() {
		$scope.status = previousHeaderStatus;
		$rootScope.$broadcast('exitEditMode');
	};

	$scope.sendMarkAsReadEvent = function() {
		$scope.status = previousHeaderStatus;
		$rootScope.$broadcast('markSelectedAsRead');
	};
}]);
