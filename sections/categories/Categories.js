function Categories($scope, backendService, feedsCache, sectionNavigator) {
	
	var categories = feedsCache.getElements();
	if(categories) {
		$scope.categories = categories;
	} else {
		var categoriesRetrieved = backendService.downloadCategories();
		categoriesRetrieved.then(function(categories){
			$scope.categories = categories;
			feedsCache.addToCache(categories);
		});
	}
	
	$scope.openElement = function(element) {
		if(element.feed_url) {
			sectionNavigator.navigateTo(sectionNavigator.section.LIST, element.id);
		} else {
			var children = feedsCache.getElements(element.id);
			if(children) {
				$scope.categories = children;
			} else {
				// Retrieve child elements from server
				var feedsRetrieved = backendService.downloadFeeds(element.id);
				feedsRetrieved.then(function(feeds){
					feedsCache.addToCache(feeds, element.id);
					$scope.categories = feeds;
				});
			}
		}
	};
}