angular.module('FeedMonkey', ['ngRoute']).config(function($routeProvider) {
	
	var path = 'sections/';
	console.log('Starting app now!');
	$routeProvider.
		when('/login', {controller: 'Login', templateUrl: 'sections/login/login.html'}).
		when('/categories/:categoryId?', {controller: 'Categories', templateUrl: 'sections/categories/categories.html'}).
		when('/list/:feedId', {controller: 'List', templateUrl: 'sections/list/list.html'}).
		when('/categories/:categoryId/articles', {controller: 'Articles', templateUrl: 'sections/articles/articles.html'}).
		otherwise({redirectTo: '/login'});
});