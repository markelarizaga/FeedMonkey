angular.module('TinyRSS').
controller('List',
	['$scope',
	'feedsCache',
	'backendService',
	'$routeParams',
	'sectionNavigator',
	'networkStatusService',
	'backgroundActivityService',
	'$rootScope',
function($scope,
		feedsCache,
		backendService,
		$routeParams,
		sectionNavigator,
		networkStatusService,
		backgroundActivityService,
		$rootScope) {

	$scope.currentPage = !sectionNavigator.isComingBack() ? 'headlines-view' : 'headlines-view-back';
	var editMode = false;

	$scope.$on('exitEditMode', function(){
		leaveEditMode();
	});

	$scope.$on('selectAll', function(){
			selectAll();
	});

	$scope.$on('markSelectedAsRead', function(){
		var selectedArticlesIds = getSelectedAndUnreadHeadlines()
				.map(function(headline){
					return headline.id;
				});
		feedsCache.markLocalArticleAsRead($routeParams.feedId, selectedArticlesIds);
		backendService.markArticlesAsRead(selectedArticlesIds);
		leaveEditMode();
	});

	$scope.$on('backPressed', function(){
		feedsCache.popTreeLevel();
	});

	backgroundActivityService.notifyBackgroundActivity();
	if(networkStatusService.isOnline() && !sectionNavigator.isComingBack()) {
		backendService.downloadHeadlines($routeParams.feedId, true)
		.then(function(headlines){
			if(headlines) {
				$scope.noArticlesToShow = false;
				$scope.headlines = headlines;
				feedsCache.addToCache(headlines, $routeParams.feedId);
				feedsCache.setHeadlinesList(headlines);
			} else {
				$scope.noArticlesToShow = true;
			}
			backgroundActivityService.notifyBackgroundActivityStopped();
		}, function() {
			getHeadlinesFromCache($routeParams.feedId);
		});

	} else {
		getHeadlinesFromCache($routeParams.feedId);
	}

	function getHeadlinesFromCache(feedId) {
		var headlines = feedsCache.getElements(feedId);
		if(headlines && headlines.constructor === Array) {
			$scope.noArticlesToShow = false;
			$scope.headlines = headlines;
			feedsCache.setHeadlinesList(headlines);
		} else {
			$scope.noArticlesToShow = true;
		}
		backgroundActivityService.notifyBackgroundActivityStopped();
	}

	$scope.openElement = function(element) {
		if(!editMode) {
			sectionNavigator.navigateTo(sectionNavigator.section.ARTICLES, element.id);
		} else {
			if(element.ui && element.ui.selected === true) {
				if(areAllHeadlinesSelected()){
					$rootScope.$broadcast('allItemsSelected');
				}
				element.ui.selected = false;
				if(getSelectedHeadlines().length === 0) {
					leaveEditMode();
					$rootScope.$broadcast('cancelEditMode');
				}
			} else {
				element.ui = {
					selected: true
				};
				if(areAllHeadlinesSelected()){
					$rootScope.$broadcast('allItemsSelected');
				}
			}
		}
	};

	$scope.onLongPress = function(headline){
		headline.ui = {
			selected: true
		};
		editMode = true;
		$rootScope.$broadcast('enterEditMode');
		if(areAllHeadlinesSelected()){
			$rootScope.$broadcast('allItemsSelected');
		}
	};

	function leaveEditMode() {
		editMode = false;
		$scope.headlines.forEach(function(headline){
			headline.ui = null;
		});
	}

	function getSelectedHeadlines() {
		return $scope.headlines.filter(function(headline){
				return (headline.ui && headline.ui.selected === true);
			});
	}

	function getSelectedAndUnreadHeadlines() {
		return $scope.headlines.filter(function(headline){
				return (headline.unread && headline.ui && headline.ui.selected === true);
			});
	}

	function isAnyHeadlineSelected () {
	  return $scope.headlines.some(function(headline) {
	    return headline.ui && headline.ui.selected;
	  });
	}

	function areAllHeadlinesSelected() {
		return $scope.headlines.every(function(headline) {
	    return headline.ui && headline.ui.selected;
	  });
	}

	function selectAll () {
		$scope.headlines.forEach(function(headline){
			headline.ui = headline.ui || {};
			headline.ui.selected = true;
		});
	}

}]);
