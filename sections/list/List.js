function List($scope, feedsCache, backendService, $routeParams, sectionNavigator) {

	var headlines = feedsCache.getElements($routeParams.feedId);
	if(headlines) {
		$scope.headlines = headlines;
		feedsCache.setHeadlinesList(headlines);
	} else {
		var headlinesRetrieved = backendService.downloadHeadlines($routeParams.feedId);
		headlinesRetrieved.then(function(headlines){
			$scope.headlines = headlines;
			feedsCache.addToCache(headlines, $routeParams.feedId);
			feedsCache.setHeadlinesList(headlines);
		});
	}

	$scope.openElement = function(element) {
		sectionNavigator.navigateTo(sectionNavigator.section.ARTICLES, element.id);
	};
}