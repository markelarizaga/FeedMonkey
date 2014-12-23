function Header($scope, sectionNavigator, feedsCache) {
	$scope.isRoot = false;
	
	sectionNavigator.addEventListener("onSectionChanged", function(newSection){
		var id = newSection.split("/");
		id = id[id.length-1];
		$scope.title = feedsCache.getElementTitle(id) || "TT-RSS";
	});
	
	$scope.goBack = function() {
		sectionNavigator.back();
	};
}