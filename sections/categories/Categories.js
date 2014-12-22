function Categories($scope, backendService, feedsCache, sectionNavigator, $routeParams) {
	
	var categories = null;
	var categoryId = $routeParams.categoryId;
	if(!categoryId) {
		categories = feedsCache.getElements()
		if(categories) {
			$scope.categories = categories;
		} else {
			var categoriesRetrieved = backendService.downloadCategories();
			categoriesRetrieved.then(function(categories){
				$scope.categories = categories;
				feedsCache.addToCache(categories);
			});
		}
	} else {
		var children = feedsCache.getElements(categoryId);
			if(children) {
				$scope.categories = children;
			} else {
				// Retrieve child elements from server
				var feedsRetrieved = backendService.downloadFeeds(categoryId);
				feedsRetrieved.then(function(feeds){
					feedsCache.addToCache(feeds, categoryId);
					$scope.categories = feeds;
				});
			}
	}
		
	
	$scope.openElement = function(element) {
		if(element.feed_url) {
			sectionNavigator.navigateTo(sectionNavigator.section.LIST, element.id);
		} else {
			sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES, element.id);
		}
	};
}