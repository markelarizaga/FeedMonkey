angular.module('TinyRSS').
factory("backendService", ['$q', 'http', 'authenticationService', 'settingsService',
function($q, http, authenticationService, settingsService){

    var specialFeedIds = {
      ALL_ARTICLES: -4
    };

    return {
        downloadCategories: downloadCategories,
        downloadFeeds: downloadFeeds,
        downloadHeadlines: downloadHeadlines,
        downloadArticle: downloadArticle,
        markArticlesAsRead: markArticlesAsRead,
        markCategoriesAsRead: markCategoriesAsRead,
        goOffline: goOffline
    };

    function downloadCategories() {
        var deferred = $q.defer();
        var token = authenticationService.getToken();
        var apiUrl = settingsService.getCredentials().serverApiUrl;
        var options = {
            "sid": token,
            "op": "getCategories",
            "unread_only": true,
            "enable_nested": false,
            "include_empty": false
        };

        sendPostRequestWithPromise(apiUrl, options, deferred);
        return deferred.promise;
    }

    function downloadFeeds(categoryId) {

        var deferred = $q.defer();
        var token = authenticationService.getToken();
        var apiUrl = settingsService.getCredentials().serverApiUrl;
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

        sendPostRequestWithPromise(apiUrl, options, deferred);
        return deferred.promise;
    }

    function downloadHeadlines(categoryId, fullArticles) {

        var deferred = $q.defer();
        var token = authenticationService.getToken();
        var apiUrl = settingsService.getCredentials().serverApiUrl;
        var options = {
            "sid": token,
            "op": "getHeadlines",
            "view_mode": "unread"
        };
        if(categoryId !== null && categoryId !== undefined) {
            options.feed_id = categoryId;
        } else {
            options.show_content = true;
            options.feed_id = specialFeedIds.ALL_ARTICLES;
        }
        if(fullArticles) {
            options.show_content = fullArticles;
        }

        sendPostRequestWithPromise(apiUrl, options, deferred);
        return deferred.promise;
    }

    function downloadArticle(articleId) {
        var deferred = $q.defer();
        var token = authenticationService.getToken();
        var apiUrl = settingsService.getCredentials().serverApiUrl;
        var options = {
            "sid": token,
            "op": "getArticle",
            "article_id": articleId
        };

        sendPostRequestWithPromise(apiUrl, options, deferred);
        return deferred.promise;
    }

    function markArticlesAsRead(articles){
        var deferred = $q.defer();
        var token = authenticationService.getToken();
        var apiUrl = settingsService.getCredentials().serverApiUrl;
        articles = articles.map(function(article) {
            return article.id;
        });
        var options = {
            "sid": token,
            "op": "updateArticle",
            "article_ids": articles.toString(),
            "mode": 0,
            "field": 2
        };

        sendPostRequestWithPromise(apiUrl, options, deferred);
        return deferred.promise;
    }

    function markCategoryAsRead(categoryId, isCategory) {
        var deferred = $q.defer();
        var token = authenticationService.getToken();
        var apiUrl = settingsService.getCredentials().serverApiUrl;
        isCategory = (isCategory === null || isCategory === undefined);
        var options = {
            "sid": token,
            "op": "catchupFeed",
            "feed_id": categoryId,
            "is_cat": isCategory
        };

        sendPostRequestWithPromise(apiUrl, options, deferred);
        return deferred.promise;
    }

    function markCategoriesAsRead(categories) {
        var deferred = $q;
        var categoriesMarkedAsRead = categories.map(function(category){
            var isCategory = category.feed_url;
            return markCategoryAsRead(category.id, isCategory);
        });
        return deferred.all(categoriesMarkedAsRead);
    }

    function goOffline (callback) {
        var deferred = $q;
        var retrieveOfflineInfo = deferred.all([downloadHeadlines(), downloadFeeds()]);

        retrieveOfflineInfo.then(function(result) {
            var articles = result[0];
            var feeds = result[1].categories.items;
            feeds = buildFeedTree(feeds, articles);
            callback(null, feeds);
        }, function() {
            callback(true, null);
        });
    }

    function removeEmptyFeeds(feeds) {
        var i = 0;
        for(i; i < feeds.length; i++) {
            if(feeds[i].children && feeds[i].children.length > 0) {
                removeEmptyFeeds(feeds[i].children);
                // Look again to the same node to check if it is empty now
                if(!feeds[i].children || feeds[i].children.length === 0) {
                    delete feeds[i];
                }
            } else {
                if(!feeds[i].content) {
                    delete feeds[i];
                }
            }
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

    // FIXME This function breaks the single responsibility principle of this
    // service, consider sending it to a different service. In addition, it
    // contains duplaicated code, maybe it can be improved
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

    /**
     * Performs a POST request and attaches the resolvers to a promise object
     * @param  {String} url     URL of the resource to POST to
     * @param  {object} options Configuration object needed by the backend API
     * @param  {object} promise Promise object that will get resolved of rejected
     * once the response from the backend arrives
     */
    function sendPostRequestWithPromise(url, options, promise){
        http.post(url, options,
            function(res) {
                var response = JSON.parse(res.responseText);
                if(response.content) {
                    promise.resolve(response.content);
                } else {
                    promise.reject();
                }
            }, function(res) {
                promise.reject(res.statusText);
            }
        );
    }
}]);
