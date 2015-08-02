angular.module('TinyRSS').
controller('List',
	['$scope',
	'feedsCache',
	'backendService',
	'$routeParams',
	'sectionNavigator',
	'networkStatusService',
function($scope, feedsCache, backendService, $routeParams, sectionNavigator, networkStatusService) {

	if(networkStatusService.isOnline() && !sectionNavigator.isComingBack()) {
		var headlinesRetrieved = backendService.downloadHeadlines($routeParams.feedId, true);
		headlinesRetrieved.then(function(headlines){
			$scope.headlines = headlines;
			feedsCache.addToCache(headlines, $routeParams.feedId);
			feedsCache.setHeadlinesList(headlines);
		});

	} else {
		var headlines = feedsCache.getElements($routeParams.feedId);
		if(headlines) {
			$scope.headlines = headlines;
			feedsCache.setHeadlinesList(headlines);
		}
	}

	$scope.openElement = function(element) {
		sectionNavigator.navigateTo(sectionNavigator.section.ARTICLES, element.id);
	};
}]);
