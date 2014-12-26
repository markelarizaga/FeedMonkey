function Articles($scope, $routeParams, backendService, feedsCache) {

	var articleId = $routeParams.articleId;
	var articleList;
	var articleCursor = 0;
	if(articleId) {
		var articleRetrieved = backendService.downloadArticle(articleId);
		articleRetrieved.then(showArticle);
	}

	$scope.onHammer = function onHammer (event) {

		switch (event.direction) {
			case 2: // left
				if(articleCursor) {
					articleCursor += 1;
					var nextArticle = articleList[articleCursor];
					if(nextArticle) {
						var articleRetrieved = backendService.downloadArticle(nextArticle.id);
						articleRetrieved.then(showArticle);
					}
				}
				break;
			case 4: // right
				if(articleCursor) {
					articleCursor -= 1;
					var previousArticle = articleList[articleCursor];
					if(previousArticle) {
						var articleRetrieved = backendService.downloadArticle(previousArticle.id);
						articleRetrieved.then(showArticle);
					}
				}
				break;
		}
	};

	function showArticle(articles){
		if(articles && articles.length > 0) {
			$scope.article = articles[0];
			backendService.markArticlesAsRead([$scope.article.id]);
			if(!articleList || !articleCursor) {
				articleList = feedsCache.getHeadlinesList();
				articleCursor = getArticleCursor(articleList);
			}
		}
	}

	function getArticleCursor(articlesList) {
		var i = 0;
		for (i; i < articlesList.length; i++) {
			if (articlesList[i].id == articleId) {
				return i;
			}
		}
		return null;
	}
}