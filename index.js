angular.module('FeedMonkey', ['ngRoute', 'LocalStorageModule', 'ngSanitize']).config(function($routeProvider) {
	
	var path = 'sections/';
	$routeProvider.
		when('/login', {controller: 'Login', templateUrl: 'sections/login/login.html'}).
		when('/categories/:categoryId?', {controller: 'Categories', templateUrl: 'sections/categories/categories.html'}).
		when('/list/:feedId', {controller: 'List', templateUrl: 'sections/list/list.html'}).
		when('/articles/:articleId', {controller: 'Articles', templateUrl: 'sections/articles/articles.html'}).
		otherwise({redirectTo: '/login'});
});