function Header($scope, sectionNavigator) {
	$scope.title = "TT-RSS";
	$scope.isRoot = sectionNavigator.isInRoot();

	$scope.goBack = function() {
		sectionNavigator.back();
	};
}