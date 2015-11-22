angular.module('TinyRSS').
controller('Categories',
	['$scope',
	'backendService',
	'feedsCache',
	'sectionNavigator',
	'$routeParams',
	'networkStatusService',
	'backgroundActivityService',
	'$rootScope',
	'syncService',
	'ListService',
function($scope,
		backendService,
		feedsCache,
		sectionNavigator,
		$routeParams,
		networkStatusService,
		backgroundActivityService,
		$rootScope,
		syncService,
		listService) {

	$scope.$on('exitEditMode', function(){
		leaveEditMode();
	});

	$scope.$on('markSelectedAsRead', function(){
		var articlesToMarkAsRead = null;
		var selectedCategories = listService.getSelected($scope.categories);
		if(networkStatusService.isOfflineMode()) {
			articlesToMarkAsRead = feedsCache.getAllArticlesUnderCategories(selectedCategories);
			syncService.addArticlesToSyncPending(articlesToMarkAsRead);
			hideMarkAsReadCategories();
			feedsCache.decreaseUnreadAmountInPath(selectedCategories);
			leaveEditMode();
			backgroundActivityService.notifyBackgroundActivityStopped();
		} else {
			hideMarkAsReadCategories();
			feedsCache.decreaseUnreadAmountInPath(selectedCategories);
			leaveEditMode();
			backendService.markCategoriesAsRead(selectedCategories)
			.then(
				function() {
					backgroundActivityService.notifyBackgroundActivityStopped();
				},
				function() {
					backgroundActivityService.notifyBackgroundActivityStopped();
					alert($filter('translate')('errorMarkingElementsAsRead'));
					leaveEditMode();
				}
			);
		}
	});

	$scope.$on('backPressed', function(){
		feedsCache.popTreeLevel();
	});

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
			backgroundActivityService.notifyBackgroundActivity();
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
			backgroundActivityService.notifyBackgroundActivity();
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
		backgroundActivityService.notifyBackgroundActivityStopped();
	}

	function getChildrenFromCache(categoryId) {
		var children = feedsCache.getElements(categoryId);
		if(children && children.constructor === Array) {
			showFeedsOnScreen(children);
		} else {
			$scope.noCategoriesAvailable = true;
		}
		backgroundActivityService.notifyBackgroundActivityStopped();
	}

	function showCategoriesOnScreen(categories) {
		backgroundActivityService.notifyBackgroundActivityStopped();
		$scope.noCategoriesAvailable = false;
		$scope.categories = categories;
		feedsCache.addToCache(categories);
	}

	function showFeedsOnScreen(feeds) {
		feedsCache.addToCache(feeds, categoryId);
		backgroundActivityService.notifyBackgroundActivityStopped();
		$scope.noCategoriesAvailable = false;
		$scope.categories = feeds;
	}

	function goToLoginPage() {
		backgroundActivityService.notifyBackgroundActivityStopped();
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
}]);
