angular.module('FeedMonkey').factory("backendService", function($q, http, authenticationService){
  
  //FIXME Don't hardcode the url
  var serverUrl = "http://lecturas.markelarizaga.com/api";
  
  function downloadCategories() {
    var deferred = $q.defer();
		var token = authenticationService.getToken();
		alert(token);
    var options = {
			sid: token,
			op: "getCategories",
			unread_only: true,
			enable_nested: false,
			include_empty: false
		};
		
		http.post(serverUrl, options,
			function(xhr) {
				alert(xhr.responseText);
				console.log(xhr.responseText);
				if(JSON.parse(xhr.responseText).content) {
				  deferred.resolve(JSON.parse(xhr.responseText).content);
				} else {
          deferred.reject();
				}
			}, function(xhr) {
				deferred.reject(xhr.statusText);
			}
		);

		return deferred.promise;
  }
  
  return {
    downloadCategories: downloadCategories
  }
});