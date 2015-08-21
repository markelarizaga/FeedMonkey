angular.module('TinyRSS').
controller('Articles',
	['$scope',
	'$routeParams',
	'backendService',
	'feedsCache',
	'networkStatusService',
	'settingsService',
	'$timeout',
function($scope, $routeParams, backendService, feedsCache, networkStatusService, settingsService, $timeout) {

	var articleCursor = 0;
	var articleList;
	var article = feedsCache.getElements($routeParams.articleId);
	var readArticles = 0;
	var helpMessageTimeout = 4000;
	$scope.currentPage = 'articles-view';
	$scope.helpAlreadyShown = settingsService.isArticleHelpShown();

	if(article && article.content) {
		// If retrieved article has all the information, show it
		showArticle(addTargetToLinks([article]));
	} else if(networkStatusService.isOnline()) {
		// If the article has only the headline, request all the info
		backendService.downloadArticle(article.id)
		.then(function(article) {
			showArticle(addTargetToLinks(article));
		});
	}

	$scope.onHammer = function onHammer (swipe) {

		switch (swipe.direction) {
			case 2:
				if(articleCursor < articleList.length-1) {
					moveToArticle('next');
				}
				break;
			case 4:
				if(articleCursor > 0) {
					moveToArticle('previous');
				}
				break;
		}
	};

	$scope.hideHelp = function() {
		$scope.helpAlreadyShown = true;
		settingsService.markArticleHelpAsShown();
		feedsCache.markLocalArticleAsRead($scope.article.feed_id, $scope.article.id);
		backendService.markArticlesAsRead([$scope.article.id]);
	};

	$timeout(function() {
		$scope.hideHelp();
	}, helpMessageTimeout);

	/**
	 * This function transforms all the link elements found in the articles to
	 * avoid the appliction to load the page without going to the system
	 * browser. By adding the target='_blank' Firefox OS leaves the app and
	 * opens the browser-
	 * @method addTargetToLinks
	 * @param {Array} articles A list of articles whose link elements need to
	 * be extended with the target attribute
	 * @return {Array} The list of articles received as articles arguments
	 * having their link elements extended with the target='_blank' attribute
	 */
	function addTargetToLinks(articles) {
		//FIXME this is not probably the best way to add target='_blank' to all links
		var i = 0;
		for(i; i < articles.length; i++) {
			articles[i].content = articles[i].content.replace(/<a/g, '<a target="_blank"');
		}
		return articles;
	}

	function showArticle(articles){
		if(articles && articles.length > 0) {
			$scope.article = articles[0];
			document.getElementById('full').scrollTop = 0;
			if($scope.article.unread && $scope.helpAlreadyShown) {
				feedsCache.markLocalArticleAsRead($scope.article.feed_id, $scope.article.id);
				backendService.markArticlesAsRead([$scope.article.id]);
			}
			if(!articleList || !articleCursor) {
				articleList = feedsCache.getHeadlinesList();
				articleCursor = getArticleCursor(articleList);
			}
			// Start a digest cycle to let Angular know the view needs an update
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		}
	}

	function getArticleCursor(articlesList) {
		var i = 0;
		for (i; i < articlesList.length; i++) {
			if (articlesList[i].id == article.id) {
				return i;
			}
		}
		return null;
	}

	function moveToArticle(direction){
		var newArticle = null;
		if(articleCursor !== null && articleCursor !== undefined) {
			articleCursor = direction === 'next' ? ++articleCursor : --articleCursor;
			newArticle = articleList[articleCursor];
			if(newArticle.content) {
				showArticle(addTargetToLinks([newArticle]));
			} else {
				var articleRetrieved = backendService.downloadArticle(newArticle.id);
				articleRetrieved.then(function(articles) {
					showArticle(addTargetToLinks(articles));
				});
			}
		}
	}

}]);
