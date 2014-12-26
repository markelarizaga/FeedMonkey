angular.module('FeedMonkey').factory("sectionNavigator", function($location){
	var section = {
		LOGIN: "/login",
		CATEGORIES: "/categories",
		LIST: "/list",
		ARTICLES: "/articles"
	};
	var events = {
		SECTION_CHANGED: "onSectionChanged"
	}
	var onSectionChangedListeners = null;
	var sectionHistory = null;
	
	function navigateTo (section, parameter, ignoreHistory) {
		if (section) {
			if(parameter) {
				section += "/" + parameter;
			}
			$location.path(section);
			if(!ignoreHistory){
				pushSectionToHistory(section);
			}
			emit(events.SECTION_CHANGED, section);
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
			navigateTo(destinationSection, null, true);
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
		for (i; i < listeners.length; i++) {
			listeners[i](params);
		}
	}
	
	function emit(event, params) {
		switch(event) {
			case events.SECTION_CHANGED:
				callListeners(onSectionChangedListeners, params);
				break;
		}
	}

	return {
		navigateTo: navigateTo,
		isInRoot: isInRoot,
		back: back,
		pushSectionToHistory: pushSectionToHistory,
		addEventListener: addEventListener,
		section: section
	};
});