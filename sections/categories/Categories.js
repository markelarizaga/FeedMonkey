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
			.then(function(categories) {
					if(categories.error && categories.error === 'NOT_LOGGED_IN') {
						goToLoginPage();
					} else {
						showCategoriesOnScreen(categories);
					}
				},
				getCategoriesFromCache); // Called in case of error

		} else {
			getCategoriesFromCache();
		}
	}

	function retrieveFeedsByCategoryId(categoryId) {
		if(networkStatusService.isOnline() && !sectionNavigator.isComingBack()) {
			backgroundActivityService.notifyBackgroundActivity();
			// Retrieve child elements from server
			backendService.downloadFeeds(categoryId)
			.then(function(feeds){
					if(feeds.error && feeds.error === 'NOT_LOGGED_IN') {
						goToLoginPage();
					} else {
						showFeedsOnScreen(feeds);
					}
				},
				function() {
					getChildrenFromCache(categoryId);
				});
		} else {
			getChildrenFromCache(categoryId);
		}
	}

	function getCategoriesFromCache() {
		categories = feedsCache.getElements();
		if(categories) {
			showCategoriesOnScreen(categories);
		} else {
			$scope.noCategoriesAvailable = true;
		}
		backgroundActivityService.notifyBackgroundActivityStopped();
	}

	function getChildrenFromCache(categoryId) {
		var children = feedsCache.getElements(categoryId);
		if(children && children.constructor === Array) {
			showFeedsOnScreen(children);
		} else {
			$scope.noCategoriesAvailable = true;
		}
		backgroundActivityService.notifyBackgroundActivityStopped();
	}

	function showCategoriesOnScreen(categories) {
		backgroundActivityService.notifyBackgroundActivityStopped();
		$scope.noCategoriesAvailable = false;
		$scope.categories = categories;
		feedsCache.addToCache(categories);
	}

	function showFeedsOnScreen(feeds) {
		feedsCache.addToCache(feeds, categoryId);
		backgroundActivityService.notifyBackgroundActivityStopped();
		$scope.noCategoriesAvailable = false;
		$scope.categories = feeds;
	}

	function goToLoginPage() {
		backgroundActivityService.notifyBackgroundActivityStopped();
		sectionNavigator.clearHistory();
		sectionNavigator.navigateTo(sectionNavigator.section.LOGIN, true, true, true);
	}

	$scope.openElement = function(element) {
		if(element.feed_url) {
			sectionNavigator.navigateTo(sectionNavigator.section.LIST, element.id);
		} else {
			sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES, element.id);
		}
	};
}]);
