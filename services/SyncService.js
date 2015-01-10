angular.module('FeedMonkey').factory("syncService", function(backendService){
  
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
    if(articlesToSync) {
      backendService.markArticlesAsRead(articlesToSync);
      articlesToSync = null;
    }
  }
  
  return {
    addToSyncPending: addToSyncPending,
    syncArticlesInServer: syncArticlesInServer
  };
});