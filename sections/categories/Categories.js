angular.module('TinyFeed').
controller('Categories', ['$scope', 'backendService', 'feedsCache', 'sectionNavigator', '$routeParams', 'networkStatusService',
function($scope, backendService, feedsCache, sectionNavigator, $routeParams, networkStatusService) {

	var categories = null;
	var categoryId = $routeParams.categoryId;
	if(!categoryId) {
		if(networkStatusService.isOnline() && !sectionNavigator.isComingBack()) {
			var categoriesRetrieved = backendService.downloadCategories();
			categoriesRetrieved.then(function(categories){
				$scope.categories = categories;
				feedsCache.addToCache(categories);
			});

		} else {
			categories = feedsCache.getElements();
			if(categories) {
				$scope.categories = categories;
			}
		}

	} else {
		if(networkStatusService.isOnline() && !sectionNavigator.isComingBack()) {
			// Retrieve child elements from server
			var feedsRetrieved = backendService.downloadFeeds(categoryId);
			feedsRetrieved.then(function(feeds){
				feedsCache.addToCache(feeds, categoryId);
				$scope.categories = feeds;
			});
		} else {
			var children = feedsCache.getElements(categoryId);
			if(children) {
				$scope.categories = children;
			}
		}
	}
		
	
	$scope.openElement = function(element) {
		if(element.feed_url) {
			sectionNavigator.navigateTo(sectionNavigator.section.LIST, element.id);
		} else {
			sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES, element.id);
		}
	};
}]);