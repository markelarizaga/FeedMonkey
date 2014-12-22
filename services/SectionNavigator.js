angular.module('FeedMonkey').factory("sectionNavigator", function($location){
	var section = {
		LOGIN: "/login",
		CATEGORIES: "/categories",
		LIST: "/list"
	}

	var sectionHistory = null;
	
	function navigateTo (section, parameter) {
		if (section) {
			if(parameter) {
				section += "/" + parameter;
			}
			$location.path(section);
			pushSectionToHistory(section);
		}
	}

	function isInRoot (){
		var returnValue = false;
		if (sectionHistory === null || sectionHistory.length === 1) {
			returnValue = true;
		}
		return returnValue;
	}

	function back() {
		var destinationSection = null;
		if(sectionHistory) {
			sectionHistory.pop();
			destinationSection = sectionHistory[sectionHistory.length-1];
			navigateTo(destinationSection);
			if(sectionHistory.length === 0) {
				sectionHistory = null;
			}
		}
	}

	function pushSectionToHistory(section) {
		if(!sectionHistory) {
			sectionHistory = [];
		}
		sectionHistory.push(section);
	}

	return {
		navigateTo: navigateTo,
		isInRoot: isInRoot,
		back: back,
		pushSectionToHistory: pushSectionToHistory,
		section: section
	};
});