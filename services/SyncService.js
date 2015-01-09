angular.module('FeedMonkey').factory("syncService", function(){
  
  var articlesToSync = null;
  
  function addToSyncPending(article) {
    if(article) {
      if(!articlesToSync) {
        articlesToSync = [];
      }
      articlesToSync.push(article);
    }
  }
  
  function syncArticlesInServer() {
    
  }
  
  return {
    addToSyncPending: addToSyncPending
  };
}