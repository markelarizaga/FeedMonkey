angular.module('TinyRSS').
factory("syncService", ['backendService', function(backendService){

  var articlesToSync = null;
  var categoriesToSync = null;

  function addArticlesToSyncPending(article) {
    if(article) {
      if(!articlesToSync) {
        articlesToSync = [];
      }
      articlesToSync = articlesToSync.concat(article);
    }
  }

  function addCategoriesToSyncPending(categories) {
      if(categories) {
        if(!categoriesToSync) {
          categoriesToSync = [];
        }
        categoriesToSync = categoriesToSync.concat(categories);
      }
  }

  function syncArticlesInServer() {
    if(articlesToSync && articlesToSync.length > 0) {
      backendService.markArticlesAsRead(articlesToSync);
      articlesToSync = null;
    }
  }

  function syncCategoriesInServer() {
    if(categoriesToSync && categoriesToSync.length > 0) {
      backendService.markCategoriesAsRead(categoriesToSync);
      categoriesToSync = null;
    }
  }

  function syncWithServer() {
      syncArticlesInServer();
      syncCategoriesInServer();
  }

  return {
    addArticlesToSyncPending: addArticlesToSyncPending,
    syncArticlesInServer: syncArticlesInServer,
    addCategoriesToSyncPending: addCategoriesToSyncPending,
    syncWithServer: syncWithServer
  };
}]);
