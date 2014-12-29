function Articles($scope, $routeParams, backendService, feedsCache, networkStatusService) {

	var articleId = $routeParams.articleId;
	var articleList;
	var articleCursor = 0;
	if(networkStatusService.isOnline() && articleId) {
		var articleRetrieved = backendService.downloadArticle(articleId);
		articleRetrieved.then(function(articles) {
			showArticle(addTargetToLinks(articles));
		});
	}

	$scope.onHammer = function onHammer (event) {

		switch (event.direction) {
			case 2:
				if(articleCursor !== null && articleCursor !== undefined) {
					articleCursor += 1;
					var nextArticle = articleList[articleCursor];
					if(nextArticle) {
						var articleRetrieved = backendService.downloadArticle(nextArticle.id);
						articleRetrieved.then(function(articles) {
							showArticle(addTargetToLinks(articles));
						});
					}
				}
				break;
			case 4:
				if(articleCursor !== null && articleCursor !== undefined) {
					articleCursor -= 1;
					var previousArticle = articleList[articleCursor];
					if(previousArticle) {
						var articleRetrieved = backendService.downloadArticle(previousArticle.id);
						articleRetrieved.then(function(articles) {
							showArticle(addTargetToLinks(articles));
						});
					}
				}
				break;
		}
	};

	//FIXME this is not probably the best way to add target='_blank' to all links
	function addTargetToLinks(articles) {
		var i = 0;
		for(i; i < articles.length; i++) {
			articles[i].content = articles[i].content.replace(/<a/g, '<a target="_blank"'); 
		}
		return articles;
	}

	function showArticle(articles){
		if(articles && articles.length > 0) {
			$scope.article = articles[0];
			window.scroll(0, 0);
			if($scope.article.unread) {
				feedsCache.markLocalArticleAsRead($scope.article.feed_id, $scope.article.id);
				backendService.markArticlesAsRead([$scope.article.id]);
			}
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