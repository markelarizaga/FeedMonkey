function Categories($scope, backendService) {
	console.log('Categories screen');
	
	var categoriesRetrieved = backendService.downloadCategories();
	categoriesRetrieved.then(function(categories){
		console.log(categories.length);
		alert(categories.length);
	});
}