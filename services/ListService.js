angular.module('TinyRSS').
factory('ListService', function() {
  return {
    getSelected: getSelected,
    isAnySelected: isAnySelected,
    areAllSelected: areAllSelected,
    selectAll: selectAll
  }

  function getSelected (list) {
    return list.filter(function(item){
				return (item.ui && item.ui.selected === true);
			});
  }

  function isAnySelected (list) {
    return list.some(function(item) {
	    return item.ui && item.ui.selected;
	  });
  }

  function areAllSelected (list) {
    return list.every(function(item) {
	    return item.ui && item.ui.selected;
	  });
  }

  function selectAll (list) {
    list.forEach(function(item){
			item.ui = item.ui || {};
			item.ui.selected = true;
		});
  }
});
