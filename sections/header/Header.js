function Header($scope, sectionNavigator, feedsCache, backendService, networkStatusService, syncService) {
	$scope.isRoot = true;
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
				feedsCache.setOfflineFeeds(feeds);
				networkStatusService.setOfflineMode(true);
				sectionNavigator.navigateTo(sectionNavigator.section.ROOT_SECTION);
			});
		} else {
			networkStatusService.setOfflineMode(false);
			feedsCache.clear();
			syncService.syncArticlesInServer();
			sectionNavigator.navigateTo(sectionNavigator.section.ROOT_SECTION);
		}
	}
}