angular.module('TinyFeed')
.factory("networkStatusService", function(){

	function isOnline() {
		return navigator.onLine;
	}

	return{
		isOnline: isOnline
	}
})