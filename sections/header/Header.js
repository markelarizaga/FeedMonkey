function Header($scope, sectionNavigator, feedsCache) {
	$scope.isRoot = true;
	
	sectionNavigator.addEventListener("onSectionChanged", function(newSection){
		var id = newSection.split("/");
		id = id[id.length-1];
		$scope.title = feedsCache.getElementTitle(id) || "TT-RSS";

		$scope.isRoot = sectionNavigator.isInRoot();
	});
	
	$scope.goBack = function() {
		sectionNavigator.back();
	};
}