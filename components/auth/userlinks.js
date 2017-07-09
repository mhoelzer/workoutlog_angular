// this will be the js file that “powers” the custom directive
(function(){
	angular.module('workoutlog')
	.directive('userlinks',
	function(){
		UserLinksController.$inject = ['$state', 'CurrentUser', 'SessionToken'];
		function UserLinksController($state, CurrentUser, SessionToken){
			var vm = this;
			vm.user = function(){
				return CurrentUser.get();
			};
			vm.signedIn = function(){
				return !!(vm.user().id);
			};
			vm.logout = function(){
				CurrentUser.clear();
				SessionToken.clear();
				$state.go('signin');
			};
		}

		// This is where the directive is configured. It is similar to the configuration of the other components. One item to note is the scope: {}; creates an isolated scope. This isolates the data to that portion of the application
		return{
			scope: {},
			controller: UserLinksController,
			controllerAs: 'ctrl',
			bindToController: true,
			templateUrl: '/components/auth/userlinks.html',
		};
	});
})();