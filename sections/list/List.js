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
		var headlinesRetrieved = backendService.downloadHeadlines($routeParams.feedId, true);
		headlinesRetrieved.then(function(headlines){
			$scope.headlines = headlines;
			feedsCache.addToCache(headlines, $routeParams.feedId);
			feedsCache.setHeadlinesList(headlines);
			backgroundActivityService.notifyBackgroundActivityStopped();
		});

	} else {
		var headlines = feedsCache.getElements($routeParams.feedId);
		if(headlines) {
			$scope.headlines = headlines;
			feedsCache.setHeadlinesList(headlines);
			backgroundActivityService.notifyBackgroundActivityStopped();
		}
	}

	$scope.openElement = function(element) {
		sectionNavigator.navigateTo(sectionNavigator.section.ARTICLES, element.id);
	};

}]);
