(function(){
	angular.module('workoutlog')
		//  JavaScript has a window object but it is a global variable.  This makes testing and maintenance difficult.  $window is Angular’s window object and helps increase testing and maintenance by controlling the scope.
		.service('SessionToken', ['$window', function($window){
			// declares and define sessiontoken()
			function SessionToken(){
				this.sessionToken = $window.localStorage.getItem('sessionToken');
			}
			SessionToken.prototype.set = function(token){
				this.sessionToken = token;
				$window.localStorage.setItem('sessionToken', token);
			};
			SessionToken.prototype.get = function(){
				return this.sessionToken;
			};
			SessionToken.prototype.clear = function(){
				this.sessionToken = undefined;
				$window.localStorage.removeItem('sessionToken');
			};
			return new SessionToken();
		}]);
})();