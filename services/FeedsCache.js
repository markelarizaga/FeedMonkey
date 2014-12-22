angular.module('FeedMonkey').factory("feedsCache", function(){
  
  var categories = null;
  
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
  }
  
  function clear() {
    categories = null;
  }
  
  function getElements(elementId) {
    var elementsToReturn = null;
    var i = 0;
    
    if(categories) {
      if (elementId === null && elementId === undefined) {
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
  
  return {
    addToCache: addToCache,
    clear: clear,
    getElements: getElements
  };
});