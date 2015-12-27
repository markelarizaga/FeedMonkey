angular.module('TinyRSS').
controller('Header',
		['$scope',
		'sectionNavigator',
		'feedsCache',
		'backendService',
		'networkStatusService',
		'syncService',
		'$filter',
		'$rootScope',
function($scope,
		sectionNavigator,
		feedsCache,
		backendService,
		networkStatusService,
		syncService,
		$filter,
		$rootScope) {

	$scope.isRoot = true;
	$scope.offline = networkStatusService.isOfflineMode();
	$scope.backgroundWorkPresent = false;
	$scope.allItemsSelected = false;
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

	$scope.$on('backgroundActivityStarted', function(){
		$scope.backgroundWorkPresent = true;
	});
	$scope.$on('backgroundActivityStoped', function(){
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

	$scope.$on('allItemsSelected', function() {
		$scope.allItemsSelected = !$scope.allItemsSelected;
	});

	$scope.goBack = function() {
		$rootScope.$broadcast('backgroundActivityStoped');
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
		$rootScope.$broadcast('backgroundActivityStoped');
		sectionNavigator.navigateTo(sectionNavigator.section.SETTINGS);
	};

	$scope.reloadFeeds = function() {
		sectionNavigator.navigateTo(sectionNavigator.section.ROOT_SECTION);
	}

	$scope.leaveEditMode = function() {
		$scope.status = previousHeaderStatus;
		$rootScope.$broadcast('exitEditMode');
		$scope.allItemsSelected = false;
	};

	$scope.sendMarkAsReadEvent = function() {
		$scope.status = previousHeaderStatus;
		$scope.backgroundWorkPresent = true;
		$rootScope.$broadcast('markSelectedAsRead');
		$scope.allItemsSelected = false;
	};

	$scope.sendSelectAllEvent = function() {
		$rootScope.$broadcast('selectAll');
		$scope.allItemsSelected = true;
	}
}]);
