angular.module('TinyRSS').
factory("sectionNavigator", ['$location', '$route', function($location, $route){
	var section = {
		LOGIN: "/login/",
		CATEGORIES: "/categories/",
		LIST: "/list/",
		ARTICLES: "/articles/",
		ROOT_SECTION: "root",
		SETTINGS: "/settings/"
	};
	var events = {
		SECTION_CHANGED: "onSectionChanged"
	}
	var onSectionChangedListeners = null;
	var sectionHistory = null;
	var comingBack = false;

	function navigateTo (destinationSection, parameter, ignoreHistory, isComingBack) {
		if (destinationSection) {
			if(parameter) {
				destinationSection += parameter;
			}
			if(destinationSection === section.ROOT_SECTION) {
				destinationSection = section.CATEGORIES;
				sectionHistory = null;
			}
			if($location.path() === destinationSection) {
				$route.reload();
			} else {
				$location.path(destinationSection);
			}
			if(!ignoreHistory){
				pushSectionToHistory(destinationSection);
			}
			if(!isComingBack) {
				comingBack = false;
			}
			emit(events.SECTION_CHANGED, destinationSection);
		}
	}

	function isInRoot (){
		var returnValue = true;
		if (sectionHistory && sectionHistory.length > 1) {
			returnValue = false;
		}
		return returnValue;
	}

	function back() {
		var destinationSection = null;
		if(sectionHistory && sectionHistory.length > 1) {
			sectionHistory.pop();
			destinationSection = sectionHistory[sectionHistory.length-1];
			comingBack = true;
			navigateTo(destinationSection, null, true, comingBack);
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
	
	function addEventListener(event, listener){
		switch(event) {
			case events.SECTION_CHANGED:
				if(!onSectionChangedListeners) {
					onSectionChangedListeners = [];
				}
				onSectionChangedListeners.push(listener);
				break;
		}
	}
	
	function removeEventListener(event, listener){
		switch(event) {
			case events.SECTION_CHANGED:
				onSectionChangedListeners.splice(onSectionChangedListeners.indexOf(listener), 1);
		}
	}
	
	function callListeners (listeners, params) {
		var i = 0;
		if(listeners) {
			for (i; i < listeners.length; i++) {
				listeners[i](params);
			}
		}
	}
	
	function emit(event, params) {
		switch(event) {
			case events.SECTION_CHANGED:
				callListeners(onSectionChangedListeners, params);
				break;
		}
	}

	function isComingBack() {
		return comingBack;
	}

	function clearHistory() {
		if(sectionHistory && sectionHistory.length > 0) {
			sectionHistory = null;
		}
	}

	return {
		navigateTo: navigateTo,
		isInRoot: isInRoot,
		back: back,
		pushSectionToHistory: pushSectionToHistory,
		addEventListener: addEventListener,
		isComingBack: isComingBack,
		section: section,
		clearHistory: clearHistory
	};
}]);