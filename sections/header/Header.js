angular.module('TinyRSS').
controller('Header', ['$scope', 'sectionNavigator', 'feedsCache', 'backendService', 'networkStatusService', 'syncService', '$filter',
function($scope, sectionNavigator, feedsCache, backendService, networkStatusService, syncService, $filter) {
	
	$scope.isRoot = true;
	$scope.offline = false;

	sectionNavigator.addEventListener("onSectionChanged", function(newSection){
		var id = newSection.split("/");
		id = id[id.length-1];
		$scope.title = feedsCache.getElementTitle(id) || "Tiny RSS";

		$scope.isRoot = sectionNavigator.isInRoot();
	});
	
	$scope.goBack = function() {
		sectionNavigator.back();
	};

	$scope.toggleOffline = function() {
		if(!networkStatusService.isOfflineMode()) {
			backendService.goOffline(function (feeds) {
				alert($filter('translate')('offlineModeReady'));
				$scope.offline = true;
				feedsCache.setOfflineFeeds(feeds);
				networkStatusService.setOfflineMode(true);
				sectionNavigator.navigateTo(sectionNavigator.section.ROOT_SECTION);
			});
		} else {
			$scope.offline = false;
			networkStatusService.setOfflineMode(false);
			feedsCache.clear();
			syncService.syncArticlesInServer();
			sectionNavigator.navigateTo(sectionNavigator.section.ROOT_SECTION);
		}
	};

	$scope.openSettings = function() {
		sectionNavigator.navigateTo(sectionNavigator.section.SETTINGS);
	};
}]);