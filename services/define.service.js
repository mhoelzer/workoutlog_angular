(function(){
	angular.module('workoutlog')
		//  JavaScript has a window object but it is a global variable.  This makes testing and maintenance difficult.  $window is Angular’s window object and helps increase testing and maintenance by controlling the scope.
		// the CU is name of service. can call w/e
		.service('DefineService', DefineService);
		
		DefineService.$inject = ['$http', 'API_BASE'];
		function DefineService($http, API_BASE){
			var defineService = this;
			defineService.userDefinitions = [];
			
			defineService.save = function(definition){
				return $http.post(API_BASE + 'definition',{
					definition: definition
				}).then(function(response){
					// unshift is lke push but puts data at front of array, not back. sutff gets sabed into array
					defineService.userDefinitions.unshift(response.data);
					console.log(response.data);
					console.log(defineService.userDefinitions);
				});
			};
			
			defineService.fetch = function(definition){
				return $http.get(API_BASE + 'definition')
					.then(function(response){
						defineService.userDefinitions = response.data;
					})
			};

			defineService.getDefinitions = function(){
				return defineService.userDefinitions;
			}
		};
})();