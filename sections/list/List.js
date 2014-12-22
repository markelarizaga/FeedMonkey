function List($scope, feedsCache, backendService, $routeParams) {

	var articles = feedsCache.getElements($routeParams.feedId);
	if(articles) {
		$scope.articles = articles;
	} else {
		var articlesRetrieved = backendService.downloadArticles($routeParams.feedId);
		articlesRetrieved.then(function(articles){
			$scope.articles = articles;
			feedsCache.addToCache(articles, $routeParams.feedId);
		});
	}
}