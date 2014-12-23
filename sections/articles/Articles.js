function Articles($scope, $routeParams, backendService) {

	var articleId = $routeParams.articleId;
	if(articleId) {
		var articleRetrieved = backendService.downloadArticle(articleId);
		articleRetrieved.then(function(articles){
			if(articles && articles.length > 0) {
				$scope.article = articles[0];
			}
		});
	}
}