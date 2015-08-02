angular.module('TinyRSS').
factory("backgroundActivityService", [
function(){

    var onActivityPresentListeners = null;
    var onActivityStoppedListeners = null;
    var events = {
        ACTIVITY_PRESENT: 'onActivityPresent',
        ACTIVITY_STOPPED: 'onActivityStopped'
    };

    function notifyBackgroundActivity() {
        emit(events.ACTIVITY_PRESENT);
    }

    function notifyBackgroundActivityStopped() {
        emit(events.ACTIVITY_STOPPED);
    }

    function addEventListener(event, listener){
		switch(event) {
			case events.ACTIVITY_PRESENT:
				if(!onActivityPresentListeners) {
					onActivityPresentListeners = [];
				}
				onActivityPresentListeners.push(listener);
				break;
            case events.ACTIVITY_STOPPED:
				if(!onActivityStoppedListeners) {
					onActivityStoppedListeners = [];
				}
				onActivityStoppedListeners.push(listener);
				break;
		}
	}

    function emit(event, params) {
		switch(event) {
			case events.ACTIVITY_PRESENT:
				callListeners(onActivityPresentListeners, params);
				break;
            case events.ACTIVITY_STOPPED:
				callListeners(onActivityStoppedListeners, params);
				break;
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

	return {
        addEventListener: addEventListener,
        notifyBackgroundActivity: notifyBackgroundActivity,
        notifyBackgroundActivityStopped: notifyBackgroundActivityStopped
	};
}]);
