angular.module('TinyRSS').
controller('Categories',
	['$scope',
	'backendService',
	'feedsCache',
	'sectionNavigator',
	'$routeParams',
	'networkStatusService',
	'$rootScope',
	'syncService',
	'ListService',
function($scope,
		backendService,
		feedsCache,
		sectionNavigator,
		$routeParams,
		networkStatusService,
		$rootScope,
		syncService,
		listService) {

	$scope.$on('exitEditMode', leaveEditMode);

	$scope.$on('markSelectedAsRead', function(){
		var articlesToMarkAsRead = null;
		var selectedCategories = listService.getSelected($scope.categories);
		if(networkStatusService.isOfflineMode()) {
			articlesToMarkAsRead = feedsCache.getAllArticlesUnderCategories(selectedCategories);
			syncService.addArticlesToSyncPending(articlesToMarkAsRead);
			hideMarkAsReadCategories();
			feedsCache.decreaseUnreadAmountInPath(selectedCategories);
			leaveEditMode();
			$rootScope.$broadcast('backgroundActivityStoped');
		} else {
			hideMarkAsReadCategories();
			feedsCache.decreaseUnreadAmountInPath(selectedCategories);
			leaveEditMode();
			backendService.markCategoriesAsRead(selectedCategories)
			.then(
				function() {
					$rootScope.$broadcast('backgroundActivityStoped');
				},
				function() {
					$rootScope.$broadcast('backgroundActivityStoped');
					alert($filter('translate')('errorMarkingElementsAsRead'));
					leaveEditMode();
				}
			);
		}
	});

	$scope.$on('backPressed', feedsCache.popTreeLevel);

	$scope.$on('selectAll', function(){
		listService.selectAll($scope.categories);
	});

	$scope.currentPage = 'categories-view';
	var categories = null;
	var editMode = false;
	var categoryId = $routeParams.categoryId;
	if(!categoryId) {
		retrieveCategories();
	} else {
		retrieveFeedsByCategoryId(categoryId);
	}

	function hideMarkAsReadCategories() {
		$scope.categories = $scope.categories.filter(function(category) {
			// Remove from the categories list those selected to be marked
			return !(category.ui && category.ui.selected);
		});
	}

	function retrieveCategories() {
		if(networkStatusService.isOnline() && !sectionNavigator.isComingBack()) {
			$rootScope.$broadcast('backgroundActivityStarted');
			backendService.downloadCategories()
			.then(function(categories) {
					if(categories.error && categories.error === 'NOT_LOGGED_IN') {
						goToLoginPage();
					} else {
						showCategoriesOnScreen(categories);
					}
				},
				getCategoriesFromCache); // Called in case of error

		} else {
			getCategoriesFromCache();
		}
	}

	function retrieveFeedsByCategoryId(categoryId) {
		if(networkStatusService.isOnline() && !sectionNavigator.isComingBack()) {
			$rootScope.$broadcast('backgroundActivityStarted');
			// Retrieve child elements from server
			backendService.downloadFeeds(categoryId)
			.then(function(feeds){
					if(feeds.error && feeds.error === 'NOT_LOGGED_IN') {
						goToLoginPage();
					} else {
						showFeedsOnScreen(feeds);
					}
				},
				function() {
					getChildrenFromCache(categoryId);
				});
		} else {
			getChildrenFromCache(categoryId);
		}
	}

	function getCategoriesFromCache() {
		categories = feedsCache.getElements();
		if(categories) {
			showCategoriesOnScreen(categories);
		} else {
			$scope.noCategoriesAvailable = true;
		}
		$rootScope.$broadcast('backgroundActivityStoped');
	}

	function getChildrenFromCache(categoryId) {
		var children = feedsCache.getElements(categoryId);
		if(children && children.constructor === Array) {
			showFeedsOnScreen(children);
		} else {
			$scope.noCategoriesAvailable = true;
		}
		$rootScope.$broadcast('backgroundActivityStoped');
	}

	function showCategoriesOnScreen(categories) {
		$rootScope.$broadcast('backgroundActivityStoped');
		$scope.noCategoriesAvailable = false;
		$scope.categories = categories;
		feedsCache.addToCache(categories);
	}

	function showFeedsOnScreen(feeds) {
		feedsCache.addToCache(feeds, categoryId);
		$rootScope.$broadcast('backgroundActivityStoped');
		$scope.noCategoriesAvailable = false;
		$scope.categories = feeds;
	}

	function goToLoginPage() {
		$rootScope.$broadcast('backgroundActivityStoped');
		sectionNavigator.clearHistory();
		sectionNavigator.navigateTo(sectionNavigator.section.LOGIN, true, true, true);
	}

	$scope.openElement = function(element) {
		if(!editMode){
			feedsCache.pushTreeLevel(element);
			if(element.feed_url) {
				sectionNavigator.navigateTo(sectionNavigator.section.LIST, element.id);
			} else {
				sectionNavigator.navigateTo(sectionNavigator.section.CATEGORIES, element.id);
			}
		} else {
			if(element.ui && element.ui.selected === true) {
				if(listService.areAllSelected($scope.categories)){
					$rootScope.$broadcast('allItemsSelected');
				}
				element.ui.selected = false;
				if(listService.getSelected($scope.categories).length === 0) {
					leaveEditMode();
					$rootScope.$broadcast('cancelEditMode');
				}
			} else {
				element.ui = {
					selected: true
				};
				if(listService.areAllSelected($scope.categories)){
					$rootScope.$broadcast('allItemsSelected');
				}
			}
		}
	};

	$scope.onLongPress = function(category){
		category.ui = {
			selected: true
		};
		editMode = true;
		$rootScope.$broadcast('enterEditMode');
		if(listService.areAllSelected($scope.categories)){
			$rootScope.$broadcast('allItemsSelected');
		}
	};

	function leaveEditMode() {
		editMode = false;
		$scope.categories.forEach(function(headline){
			headline.ui = null;
		});
	}

	$scope.goBack = function(){
		feedsCache.popTreeLevel();
		sectionNavigator.back();
	};
}]);
