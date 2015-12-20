angular.module('TinyRSS').
factory("feedsCache", ['localStorageService', function(localStorageService){

  var categories = null;
  var currentHeadlines = null;
  var currentPath = [];

  return {
      addToCache: addToCache,
      clear: clear,
      getElements: getElements,
      getElementTitle: getElementTitle,
      setHeadlinesList: setHeadlinesList,
      getHeadlinesList: getHeadlinesList,
      markLocalArticleAsRead: markLocalArticleAsRead,
      setOfflineFeeds: setOfflineFeeds,
      getAllArticlesUnderCategories: getAllArticlesUnderCategories,
      pushTreeLevel: pushTreeLevel,
      popTreeLevel: popTreeLevel,
      decreaseUnreadAmountInPath: decreaseUnreadAmountInPath
  };

  function decreaseUnreadAmountInPath(categoriesMarkedAsRead) {
    var unreadElements = categoriesMarkedAsRead.reduce(function(unreadElements, category){
      return unreadElements + category.unread;
    }, 0);
    if(currentPath && currentPath.length > 0) {
      currentPath.forEach(function(pathLevel){
        pathLevel.unread -= unreadElements;
      });
      var visibleCategories = currentPath[currentPath.length-1].children;
      categoriesMarkedAsRead.forEach(function(readCategory, index){
        for(var i = 0; i < visibleCategories.length; i++){
          if(readCategory.id === visibleCategories[i].id){
            visibleCategories.splice(i,1);
          }
        }
      });
    }
  }

  function pushTreeLevel(level){
    currentPath = currentPath || [];
    currentPath.push(level);
  }

  function popTreeLevel(){
    currentPath = currentPath || [];
    currentPath.pop();
  }

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

  function containsCategory(categoryList, category) {
      return categoryList.some(function(item){
          if(item.id === category.id) {
              return true;
          }
      });
  }

  function isCategory(category) {
      return (category.feed_url === null || category.feed_url === undefined);
  }

  function getAllArticlesUnderCategories(categories) {
    var articles = [];
    for(var i = 0; i < categories.length; i++){
      articles = articles.concat(getAllArticlesUnderCategory(categories[i]));
    }
    return articles;
  }

  function getAllArticlesUnderCategory(categoryTree) {
      var articleList = [];
      var i = 0;
      if(categoryTree.children) {
        for(i; i < categoryTree.children.length; i++) {
            if(categoryTree.children[i].feed_url) {
                articleList = articleList.concat(categoryTree.children[i].children);
            } else if(categoryTree.children[i].content){
                articleList.push(categoryTree.children[i]);
            } else {
                articleList = articleList.concat(getAllArticlesUnderCategory(categoryTree.children[i]));
            }
        }
      }
      return articleList;
  }

  function removeCategoryFromList(categoryList, category) {
      return categoryList.filter(function(item){
          if(item.id !== category.id) {
              return true;
          }
      });
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

    function markLocalArticleAsRead(feedId, articles) {
        var feedInfo = null;
        var articleList = null;
        var i = 0, j = 0;
        var articleIds = articles.map(function(article){
					return article.id;
				});
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
}]);
