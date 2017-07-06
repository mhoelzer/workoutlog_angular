(function(){
	angular
		.module('workoutlog.auth.signup', ['ui.router'])
		.config(signupConfig);

		// $stateProvider is from ui-router and is the method through which url routing is handled.
		function signupConfig($stateProvider){
			$stateProvider
				// defines this component as the state of signup and provides the url route
				.state('signup',{
					url: '/signup',
					// templateUrl is the html the component will use
					templateUrl: '/components/auth/signup.html',
					// controller indicates which controller will dictate the behavior of this view
					controller: SignUpController,
					// controllerAs creates an alias so a developer doesn’t have to type SignUpController.<function or object>
					controllerAs: 'ctrl',
					// bindToController binds the scope of the view to the scope of this controller and eliminates the need to use $scope
					bindToController: this
				});
		}

		signupConfig.$inject = ['$stateProvider'];

		// SignUpController has $state and UsersService injected into it
		function SignUpController($state, UsersService){
			// var vm = this; is how the binding of the controller to the view is completed
			var vm = this;
			// vm.user = {}; establishes an object to build the username and password inside
			vm.user = {};
			// vm.message = “Sign up for an account!” is an example of expressions and how vm and this scope work together.
			vm.message = "Sign up for an account!!!!!!! WSEFKNvkfdlvc";
			vm.submit = function(){
				// ng-model and ng-submit create the vm.user object that UserService.create uses to sign a new user up to our application
				// .then is how the SignUpController handles the resolved promise and then routes the app to the define feature of the WorkoutLog
				UsersService.create(vm.user).then(function(response){
					// This display the response data in the console for Chrome Dev Tools
					console.log(response);
					// $state.go(‘define’) is how ui-route changes from state (url) to other states
					$state.go('define');
				});
			};
		}

		SignUpController.$inject = ['$state', 'UsersService'];
})();