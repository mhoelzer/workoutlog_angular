(function(){
	angular.module('workoutlog')
		//  JavaScript has a window object but it is a global variable.  This makes testing and maintenance difficult.  $window is Angular’s window object and helps increase testing and maintenance by controlling the scope.
		// the CU is name of service. can call w/e
		.service('CurrentUser', ['$window', function($window){
			// declares and define sessiontoken()
			function CurrentUser(){
				// looks inside browers lS and grabs in of cU prop and setting to variable called currU
				var currUser = $window.localStorage.getItem('currentUser');
				if (currUser && currUser !== "undefined"){
					this.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
				}
			}
			CurrentUser.prototype.set = function(user){
				this.currentUser = user;
				$window.localStorage.setItem('currentUser', JSON.stringify(user));
			};
			CurrentUser.prototype.get = function(){
				return this.currentUser || {};
			};
			CurrentUser.prototype.clear = function(){
				this.currentUser = undefined;
				$window.localStorage.removeItem('currentUser');
			};
			CurrentUser.prototype.isSignedIn = function(){
				// !! ensures that isSignedIn flips the boolean correctly. think through what occurs when a user signs in and how the use of a boolean could indicate that in code.
				return !!this.get().id;
			}
			return new CurrentUser();
		}]);
})();