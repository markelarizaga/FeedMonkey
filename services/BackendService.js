angular.module('TinyRSS').
factory("backendService", ['$q', 'http', 'authenticationService', 'settingsService',
function($q, http, authenticationService, settingsService){

  function downloadCategories() {
    var deferred = $q.defer();
		var token = authenticationService.getToken();
    var options = {
			"sid": token,
			"op": "getCategories",
			"unread_only": true,
			"enable_nested": false,
			"include_empty": false
		};
		http.post(settingsService.getCredentials().serverApiUrl, options,
			function(xhr) {
				if(JSON.parse(xhr.responseText).content) {
				  deferred.resolve(JSON.parse(xhr.responseText).content);
				} else {
          deferred.reject();
				}
			}, function(xhr) {
				deferred.reject(xhr.statusText);
			}
		);

		return deferred.promise;
  }

	function downloadFeeds(categoryId) {

		var deferred = $q.defer();
		var token = authenticationService.getToken();
		var options = null;
		if(categoryId !== null && categoryId !== undefined) {
			options = {
				"sid": token,
				"op": "getFeeds",
				"unread_only": true,
				"cat_id": categoryId
			};

		} else {
			options = {
				"sid": token,
				"op": "getFeedTree",
				"include_empty": false
			};
		}

		http.post(settingsService.getCredentials().serverApiUrl, options,
			function(xhr) {
				if(JSON.parse(xhr.responseText).content) {
					deferred.resolve(JSON.parse(xhr.responseText).content);
				} else {
          deferred.reject();
				}
			}, function(xhr) {
				deferred.reject(xhr.statusText);
			}
		);

		return deferred.promise;
	}

	function downloadHeadlines(categoryId, fullArticles) {

		var deferred = $q.defer();
		var token = authenticationService.getToken();
    	var options = null;

		if(categoryId !== null && categoryId !== undefined) {
			options = {
				"sid": token,
				"op": "getHeadlines",
				"view_mode": "unread",
				"feed_id": categoryId
			};

		} else {
			options = {
				"sid": token,
				"op": "getHeadlines",
				"view_mode": "unread",
				"show_content": true,
				"feed_id": -4 // All articles
			};
		}
        if(fullArticles) {
            options["show_content"] = fullArticles;
        }
		http.post(settingsService.getCredentials().serverApiUrl, options,
			function(xhr) {
				if(JSON.parse(xhr.responseText).content) {
					deferred.resolve(JSON.parse(xhr.responseText).content);
				} else {
          			deferred.reject();
				}
			}, function(xhr) {
				deferred.reject(xhr.statusText);
			}
		);

		return deferred.promise;
	}

	function downloadArticle(articleId) {
		var deferred = $q.defer();
		var token = authenticationService.getToken();
    	var options = {
			"sid": token,
			"op": "getArticle",
			"article_id": articleId,
		};
		http.post(settingsService.getCredentials().serverApiUrl, options,
			function(xhr) {
				if(JSON.parse(xhr.responseText).content) {
				  deferred.resolve(JSON.parse(xhr.responseText).content);
				} else {
          			deferred.reject();
				}
			}, function(xhr) {
				deferred.reject(xhr.statusText);
			}
		);

		return deferred.promise;
	}

	function markArticlesAsRead(articles){
		var deferred = $q.defer();
		var token = authenticationService.getToken();
    	var options = {
			"sid": token,
			"op": "updateArticle",
			"article_ids": articles.toString(),
			"mode": 0,
			"field": 2
		};
		http.post(settingsService.getCredentials().serverApiUrl, options,
			function(xhr) {
				if(JSON.parse(xhr.responseText).content) {
				  deferred.resolve(JSON.parse(xhr.responseText).content);
				} else {
          			deferred.reject();
				}
			}, function(xhr) {
				deferred.reject(xhr.statusText);
			}
		);

		return deferred.promise;
	}

	function removeEmptyFeeds(feeds) {
		var i = 0;
		for(i; i < feeds.length; i++) {
			if(feeds[i].children && feeds[i].children.length > 0) {
				removeEmptyFeeds(feeds[i].children);
				// Look again to the same node to check if it it empty now
				if(!feeds[i].children || feeds[i].children.length === 0) {
					delete feeds[i];
				}
			} else {
				if(!feeds[i].content) {
					delete feeds[i];
				}
			}
		}
		for(i = 0; i < feeds.length; i++) {
			if(feeds[i] === undefined || feeds[i] === null) {
				feeds.splice(i, 1);
				i -= 1;
			}
		}
		return feeds;
	}

	function groupArticlesByFeed(feeds, articles) {
		var article = null;
		var i = null;

		do { // put the articles inside their corresponding feeds
			article = articles.shift();
			for(i = 0; i < feeds.length; i++) {
				if(!feeds[i].unread) {
					feeds[i].unread = 0;
				}
				for(var j = 0; j < feeds[i].items.length; j++) {
					if(article.feed_id == feeds[i].items[j].bare_id) {
						if(!feeds[i].items[j].children) {
							feeds[i].items[j].children = [];
							feeds[i].items[j].unread = 0;
						}
						feeds[i].items[j].children.push(article);
						// Add one to the unread articles count
						feeds[i].items[j].unread++;
						feeds[i].unread++;
					}
				}
			}
		} while (articles.length > 0);
		return feeds;
	}

	function transformFeeds(feeds) {
		var i = 0;
		var j = 0;

		// Transform the feeds and articles to match the expectations of the app to render them
		for(i; i < feeds.length; i++) {
			// Change name property by title
			feeds[i].title = feeds[i].name;
			delete feeds[i].name;
			// Change items property by children
			feeds[i].children = feeds[i].items;
			delete feeds[i].items;
			// If the item is a feed, add a dummy feed_url (needed for the app to know if it is a feed)
			if(feeds[i].id.indexOf("FEED") !== -1) {
				feeds[i].feed_url = feeds[i].title;
			}
			// Use id property to store the usual id, located in bare_id
			feeds[i].id = feeds[i].bare_id;
			for(j = 0; j < feeds[i].children.length; j++) {
				// Change name property by title
				feeds[i].children[j].title = feeds[i].children[j].name;
				delete feeds[i].children[j].name;
				// If the item is a feed, add a dummy feed_url (needed for the app to know if it is a feed)
				if(feeds[i].children[j].id.indexOf("FEED") !== -1) {
					feeds[i].children[j].feed_url = feeds[i].children[j].title;
				}
				// Use id property to store the usual id, located in bare_id
				feeds[i].children[j].id = feeds[i].children[j].bare_id;
			}
		}
		return feeds;
	}

	function buildFeedTree (feeds, articles) {
		feeds = groupArticlesByFeed(feeds, articles);
		feeds = transformFeeds(feeds);
		feeds = removeEmptyFeeds(feeds);
		return feeds;
	}

	function goOffline (callback) {
		var deferred = $q;
		var offlineInfoRetrieved = deferred.all([downloadHeadlines(), downloadFeeds()]);

		offlineInfoRetrieved.then(function(result) {
			var articles = result[0];
			var feeds = result[1].categories.items;
			feeds = buildFeedTree(feeds, articles);
			callback(feeds);
		});
	}

	return {
    	downloadCategories: downloadCategories,
		downloadFeeds: downloadFeeds,
		downloadHeadlines: downloadHeadlines,
		downloadArticle: downloadArticle,
		markArticlesAsRead: markArticlesAsRead,
		goOffline: goOffline,
	}
}]);
