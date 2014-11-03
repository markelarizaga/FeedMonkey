angular.module('FeedMonkey').factory("sectionNavigator", function($location){
	var sections = {
		login: "/login",
		categories: "/categories",
	}

	return {
		navigateTo: function (section) {
			if(sections[section]) {
				$location.path(sections[section]);
			}
		}
	};
});