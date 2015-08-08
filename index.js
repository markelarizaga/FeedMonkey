angular.module('TinyRSS',
    ['ngRoute',
    'ngAnimate',
    'LocalStorageModule',
    'ngSanitize',
    'hmTouchEvents',
    'ngCookies',
    'pascalprecht.translate'])

.config(["$compileProvider", function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(file|https?|ftp|mailto|app):/);
}])

.config(['$routeProvider',function($routeProvider) {
	$routeProvider.
		when('/login', {controller: 'Login', templateUrl: 'sections/login/login.html'}).
		when('/categories/:categoryId?', {controller: 'Categories', templateUrl: 'sections/categories/categories.html'}).
		when('/list/:feedId', {controller: 'List', templateUrl: 'sections/list/list.html'}).
		when('/articles/:articleId', {controller: 'Articles', templateUrl: 'sections/articles/articles.html'}).
		when('/settings', {controller: 'Settings', templateUrl: 'sections/settings/settings.html'}).
		otherwise({redirectTo: '/login'});
}])

.config(['$translateProvider',function($translateProvider) {
	$translateProvider.translations('en', tinyRss.locales.en);
	$translateProvider.translations('eu', tinyRss.locales.eu);
	$translateProvider.translations('es', tinyRss.locales.es);

    $translateProvider.fallbackLanguage('en');
	$translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();
}]);
