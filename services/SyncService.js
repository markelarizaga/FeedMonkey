angular.module('TinyRSS').
factory("syncService", ['backendService', function(backendService){

  var articlesToSync = null;
  var categoriesToSync = null;

  function addToSyncPending(article) {
    if(article) {
      if(!articlesToSync) {
        articlesToSync = [];
      }
      articlesToSync.push(article);
    }
  }

  function addCategoriesToSyncPending(categories) {
      if(categories) {
        if(!categoriesToSync) {
          categoriesToSync = [];
        }
        categoriesToSync.concat(categories);
      }
  }

  function syncArticlesInServer() {
    if(articlesToSync) {
      backendService.markArticlesAsRead(articlesToSync);
      articlesToSync = null;
    }
  }

  function syncCategoriesInServer() {
    if(categoriesToSync) {
      backendService.markCategoriesAsRead(categoriesToSync);
      categoriesToSync = null;
    }
  }

  function syncWithServer() {
      syncArticlesInServer();
      syncCategoriesInServer();
  }

  return {
    addToSyncPending: addToSyncPending,
    syncArticlesInServer: syncArticlesInServer,
    addCategoriesToSyncPending: addCategoriesToSyncPending,
    syncWithServer: syncWithServer
  };
}]);
