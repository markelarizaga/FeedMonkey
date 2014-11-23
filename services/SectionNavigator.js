angular.module('FeedMonkey').factory("sectionNavigator", function($location){
	var section = {
		LOGIN: "/login",
		CATEGORIES: "/categories",
	}
	
	function navigateTo (section) {
			if (section) {
					$location.path(section);
			}
	}

	return {
		navigateTo: navigateTo,
		section: section
	};
});