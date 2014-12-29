angular.module('FeedMonkey').factory("feedsCache", function(localStorageService){
  
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
    categories = null;
  }
  
  function inspectCachedTree (cachedTree, elementId) {
    var i = 0;
    var foundElement = null;
    for(i; i < cachedTree.length; i++) {
      // There are only two equals because the ids can be both numbers or strings
      if(cachedTree[i].id == elementId) {
        return cachedTree[i].children;
        
      } else if(cachedTree[i].children) {
        foundElement = inspectCachedTree(cachedTree[i].children, elementId);
        if(foundElement) {
          return foundElement;
        }
      }
    }
    return null;
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

  function markLocalArticleAsRead(feedId, articleId) {
    var articleList = null;
    var i = 0;
    categories = categories || getPersistent();
    
    if(categories) {
      articleList = inspectCachedTree(categories, feedId);
      if(articleList) {
        for(i; i < articleList.length; i++) {
          if(articleList[i].id == articleId) {
            articleList[i].unread = false;
            return;
          }
        }
      }
    }
    
  }
  
  return {
    addToCache: addToCache,
    clear: clear,
    getElements: getElements,
    getElementTitle: getElementTitle,
    setHeadlinesList: setHeadlinesList,
    getHeadlinesList: getHeadlinesList,
    markLocalArticleAsRead: markLocalArticleAsRead
  };
});