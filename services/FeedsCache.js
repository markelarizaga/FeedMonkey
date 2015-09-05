angular.module('TinyRSS').
factory("feedsCache", ['localStorageService', function(localStorageService){

  var categories = null;
  var currentHeadlines = null;

  function makePersistent(obj) {
    localStorageService.set('feeds',JSON.stringify(obj));
  }

  function getPersistent() {
    return localStorageService.get('feeds');
  }

  function cacheSubcategory(cachedTree, parentItemId, elementsList) {
    var i = 0;
    var subcategoryFound = false;

    for(i; i < cachedTree.length; i++) {
      // There are only two equals because the ids can be both numbers or strings
      if(cachedTree[i].id == parentItemId) {
        cachedTree[i].children = elementsList;
        return true;

      } else if(cachedTree[i].children) {
        subcategoryFound = cacheSubcategory(cachedTree[i].children, parentItemId, elementsList);
      }
    }
    return subcategoryFound;
  }

  function addToCache(elementsList, parentItemId) {
    if(parentItemId === null || parentItemId === undefined) {
      categories = elementsList;
    } else {
      cacheSubcategory(categories, parentItemId, elementsList);
    }
    makePersistent(categories);
  }

  function clear() {
    categories = [];
  }

  function inspectCachedTree (cachedTree, elementId, extendedInfo) {
    var i = 0;
    var foundElement = null;
    for(i; i < cachedTree.length; i++) {
      // There are only two equals because the ids can be both numbers or strings
      if(cachedTree[i].id == elementId) {
          if(extendedInfo) {
              return {
                  parentCategories: [],
                  parentFeed: cachedTree[i],
                  elements: cachedTree[i].children
              };
          } else {
            return cachedTree[i].children || cachedTree[i];
          }

      } else if(cachedTree[i].children) {
        foundElement = inspectCachedTree(cachedTree[i].children, elementId, extendedInfo);
        if(foundElement) {
            if(extendedInfo) {
                foundElement.parentCategories.unshift(cachedTree[i]);
            }
          return foundElement;
        }
      }
    }
    return null;
  }

  function getArticleListByCategories(categoriesToInspect) {
      var i = 0;
      var articleList = [];
      for(i; i < categories.length; i++) {

      }
  }

  function getElements(elementId) {
    var elementsToReturn = null;
    var i = 0;
    categories = categories || getPersistent();

    if(categories) {
      if (elementId === null || elementId === undefined) {
        elementsToReturn = categories;
      } else {
        elementsToReturn = inspectCachedTree(categories, elementId);
      }
    }
    return elementsToReturn;
  }

  function getElementTitle(elementId) {
    var returnTitle = "";
    var i = 0;
    if(categories && elementId !== null && elementId !== undefined) {
      for(i; i < categories.length; i++) {
        if(categories[i].id === elementId) {
          returnTitle = categories[i].title;
        }
      }
    }
    return returnTitle;
  }

  function setHeadlinesList (headlines) {
    currentHeadlines = headlines;
  }

  function getHeadlinesList () {
    return currentHeadlines;
  }

  function decreaseUnreadAmount(feedInfo) {
      var i = 0;
      feedInfo.parentFeed.unread--;
      for(i; i < feedInfo.parentCategories.length; i++) {
          feedInfo.parentCategories[i].unread--;
      }
  }

    function markLocalArticleAsRead(feedId, articleIds) {
        var feedInfo = null;
        var articleList = null;
        var i = 0, j = 0;
        categories = categories || getPersistent();

        if(categories) {
            feedInfo = inspectCachedTree(categories, feedId, true);
            articleList = feedInfo.elements;
            if(articleList) {
                for(j; j < articleIds.length; j++) {
                    for(i; i < articleList.length; i++) {
                        if(articleList[i].id == articleIds[j] && articleList[i].unread) {
                            articleList[i].unread = false;
                            decreaseUnreadAmount(feedInfo);
                            break;
                        }
                    }
                }
            }
        }
    }

    function setOfflineFeeds(feeds) {
        categories = feeds;
    }

    return {
        addToCache: addToCache,
        clear: clear,
        getElements: getElements,
        getElementTitle: getElementTitle,
        setHeadlinesList: setHeadlinesList,
        getHeadlinesList: getHeadlinesList,
        markLocalArticleAsRead: markLocalArticleAsRead,
        setOfflineFeeds: setOfflineFeeds
  };
}]);
