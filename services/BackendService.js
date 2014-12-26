angular.module('FeedMonkey').factory("backendService", function($q, http, authenticationService){
  
  //FIXME Don't hardcode the url
  var serverUrl = "http://lecturas.markelarizaga.com/api/";
  
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
		http.post(serverUrl, options,
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
    	var options = {
			"sid": token,
			"op": "getFeeds",
			"unread_only": true,
			"cat_id":categoryId
		};
		http.post(serverUrl, options,
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

	function downloadHeadlines(categoryId) {

		var deferred = $q.defer();
		var token = authenticationService.getToken();
    	var options = {
			"sid": token,
			"op": "getHeadlines",
			"view_mode": "unread",
			"feed_id":categoryId
		};
		http.post(serverUrl, options,
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
		http.post(serverUrl, options,
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
		http.post(serverUrl, options,
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
  
	return {
    	downloadCategories: downloadCategories,
		downloadFeeds: downloadFeeds,
		downloadHeadlines: downloadHeadlines,
		downloadArticle: downloadArticle,
		markArticlesAsRead: markArticlesAsRead
  }
});