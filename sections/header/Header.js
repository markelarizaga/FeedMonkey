function Header($scope, sectionNavigator, feedsCache, backendService, networkStatusService, syncService) {
	
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
				alert("Offline mode is ready");
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
	}
}