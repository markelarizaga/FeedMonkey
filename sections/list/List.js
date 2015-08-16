angular.module('TinyRSS').
controller('List',
	['$scope',
	'feedsCache',
	'backendService',
	'$routeParams',
	'sectionNavigator',
	'networkStatusService',
	'backgroundActivityService',
function($scope, feedsCache, backendService, $routeParams, sectionNavigator, networkStatusService, backgroundActivityService) {

	$scope.currentPage = !sectionNavigator.isComingBack() ? 'headlines-view' : 'headlines-view-back';

	backgroundActivityService.notifyBackgroundActivity();
	if(networkStatusService.isOnline() && !sectionNavigator.isComingBack()) {
		backendService.downloadHeadlines($routeParams.feedId, true)
		.then(function(headlines){
			$scope.headlines = headlines;
			feedsCache.addToCache(headlines, $routeParams.feedId);
			feedsCache.setHeadlinesList(headlines);
			backgroundActivityService.notifyBackgroundActivityStopped();
		}, function() {
			getHeadlinesFromCache($routeParams.feedId);
		});

	} else {
		getHeadlinesFromCache($routeParams.feedId);
	}

	function getHeadlinesFromCache(feedId) {
		var headlines = feedsCache.getElements(feedId);
		if(headlines && headlines.constructor === Array) {
			$scope.headlines = headlines;
			feedsCache.setHeadlinesList(headlines);
		}
		backgroundActivityService.notifyBackgroundActivityStopped();
	}

	$scope.openElement = function(element) {
		sectionNavigator.navigateTo(sectionNavigator.section.ARTICLES, element.id);
	};

}]);
