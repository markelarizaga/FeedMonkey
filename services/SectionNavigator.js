angular.module('FeedMonkey').factory("sectionNavigator", function($location){
	var section = {
		LOGIN: "/login",
		CATEGORIES: "/categories",
		LIST: "/list"
	}
	
	function navigateTo (section, parameter) {
		if (section) {
			if(parameter) {
				section += "/" + parameter;
			}
			$location.path(section);
		}
	}

	return {
		navigateTo: navigateTo,
		section: section
	};
});