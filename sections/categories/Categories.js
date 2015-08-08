angular.module('TinyRSS').
controller('Categories',
	['$scope',
	'backendService',
	'feedsCache',
	'sectionNavigator',
	'$routeParams',
	'networkStatusService',
	'backgroundActivityService',
function($scope, backendService, feedsCache, sectionNavigator, $routeParams, networkStatusService, backgroundActivityService) {

	$scope.currentPage = !sectionNavigator.isComingBack() ? 'categories-view' : 'categories-view-back';
	var categories = null;
	var categoryId = $routeParams.categoryId;
	if(!categoryId) {
		retrieveCategories();
	} else {
		retrieveFeedsByCategoryId(categoryId);
	}

	function retrieveCategories() {
		if(networkStatusService.isOnline() && !sectionNavigator.isComingBack()) {
			backgroundActivityService.notifyBackgroundActivity();
			backendService.downloadCategories()
			.then(showCategoriesOnScreen);

		} else {
			categories = feedsCache.getElements();
			if(categories) {
				$scope.categories = categories;
			}
		}
	}

	function retrieveFeedsByCategoryId(categoryId) {
		if(networkStatusService.isOnline() && !sectionNavigator.isComingBack()) {
			backgroundActivityService.notifyBackgroundActivity();
			// Retrieve child elements from server
			backendService.downloadFeeds(categoryId)
			.then(showFeedsOnScreen);
		} else {
			var children = feedsCache.getElements(categoryId);
			if(children) {
				$scope.categories = children;
			}
		}
	}

	function showCategoriesOnScreen(categories) {
		backgroundActivityService.notifyBackgroundActivityStopped();
		$scope.categories = categories;
		feedsCache.addToCache(categories);
	}

	function showFeedsOnScreen(feeds) {
		feedsCache.addToCache(feeds, categoryId);
		backgroundActivityService.notifyBackgroundActivityStopped();
		$scope.categories = feeds;
	}

	$scope.openElement = function(element) {
		if(element.feed_url) {
			sectionNavigator.navigateTo(sectionNavigator.section.LIST, element.id);
		} else {
			sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES, element.id);
		}
	};
}]);
