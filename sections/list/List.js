function List($scope, feedsCache, backendService, $routeParams) {

	var headlines = feedsCache.getElements($routeParams.feedId);
	if(headlines) {
		$scope.headlines = headlines;
	} else {
		var headlinesRetrieved = backendService.downloadHeadlines($routeParams.feedId);
		headlinesRetrieved.then(function(headlines){
			$scope.headlines = headlines;
			feedsCache.addToCache(headlines, $routeParams.feedId);
		});
	}
}