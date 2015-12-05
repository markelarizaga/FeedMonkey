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
	'ListService',
function($scope,
		feedsCache,
		backendService,
		$routeParams,
		sectionNavigator,
		networkStatusService,
		backgroundActivityService,
		$rootScope,
		listService) {

	$scope.currentPage = !sectionNavigator.isComingBack() ? 'headlines-view' : 'headlines-view-back';
	var editMode = false;

	$scope.$on('exitEditMode', function(){
		leaveEditMode();
	});

	$scope.$on('selectAll', function(){
			listService.selectAll($scope.headlines);
	});

	$scope.$on('markSelectedAsRead', function(){
		var selectedArticles = getSelectedAndUnreadHeadlines();
		feedsCache.markLocalArticleAsRead($routeParams.feedId, selectedArticles);
		backendService.markArticlesAsRead(selectedArticles);
		leaveEditMode();
		backgroundActivityService.notifyBackgroundActivityStopped();
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
				if(listService.areAllSelected($scope.headlines)){
					$rootScope.$broadcast('allItemsSelected');
				}
				element.ui.selected = false;
				if(listService.getSelected($scope.headlines).length === 0) {
					leaveEditMode();
					$rootScope.$broadcast('cancelEditMode');
				}
			} else {
				element.ui = {
					selected: true
				};
				if(listService.areAllSelected($scope.headlines)){
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
		if(listService.areAllSelected($scope.headlines)){
			$rootScope.$broadcast('allItemsSelected');
		}
	};

	function leaveEditMode() {
		editMode = false;
		$scope.headlines.forEach(function(headline){
			headline.ui = null;
		});
	}

	function getSelectedAndUnreadHeadlines() {
		return $scope.headlines.filter(function(headline){
				return (headline.unread && headline.ui && headline.ui.selected === true);
			});
	}
}]);
