angular.module('FeedMonkey').factory("feedsCache", function(localStorageService){
  
  var categories = null;
  
  function makePersistent(obj) {
    localStorageService.set('feeds',JSON.stringify(obj));
  }
  
  function getPersistent() {
    return localStorageService.get('feeds');
  }
  
  function cacheSubcategory(parentItemId, elementsList) {
    var i = 0;
    for(i; i < categories.length; i++) {
      if(categories[i].id === parentItemId) {
        categories[i].children = elementsList;
      }
    }
  }
  
  function addToCache(elementsList, parentItemId) {
    if(parentItemId === null || parentItemId === undefined) {
      categories = elementsList;
    } else {
      cacheSubcategory(parentItemId, elementsList);
    }
    makePersistent(categories);
  }
  
  function clear() {
    categories = null;
  }
  
  function getElements(elementId) {
    var elementsToReturn = null;
    var i = 0;
    categories = categories || getPersistent();
    
    if(categories) {
      if (elementId === null || elementId === undefined) {
        elementsToReturn = categories
      } else {
        for(i; i < categories.length; i++) {
          if(categories[i].id === elementId) {
           elementsToReturn = categories[i].children;
          }
        }
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
  
  return {
    addToCache: addToCache,
    clear: clear,
    getElements: getElements,
    getElementTitle: getElementTitle
  };
});