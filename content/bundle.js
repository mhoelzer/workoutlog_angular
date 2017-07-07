(function(){
	var app = angular.module('workoutlog',[
		'ui.router',
		'workoutlog.auth.signup',
		'workoutlog.auth.signin',
		'workoutlog.define',
		'workoutlog.logs'
	]);
	function config($urlRouterProvider){
		$urlRouterProvider.otherwise('/signin');
	}
	// $inject: directive form angular to inject dependecies
	config.$inject = ['$urlRouterProvider'];
	app.config(config);
	app.constant('API_BASE', '//localhost:3000/api/');
})();
(function(){
	angular.module('workoutlog.define', [
		'ui.router'
	]) 
	.config(defineConfig)
	
	function defineConfig($stateProvider){
		$stateProvider
			.state('define',{
				url: '/define',
				templateUrl: '/components/define/define.html',
				controller: DefineController,
				controllerAs: 'ctrl',
				bindToController: this,
				resolve: [
					'CurrentUser', '$q', '$state',
					function(CurrentUser, $q, $state){
						var deferred = $q.defer();
						if (CurrentUser.isSignedIn()){
							deferred.resolve();
						} else {
							deferred.reject();
							$state.go('signin');
						}
						return deferred.promise;
					}
				]
			})
	};

	defineConfig.$inject = ['$stateProvider'];

	function DefineController($state, DefineService){
		var vm = this;
		vm.message = "Define a workout category here";
		vm.saved = false; 
		vm.definition = {};
		vm.save = function() {
			DefineService.save(vm.definition)
				.then(function(){
					vm.saved = true;
					$state.go('logs')
				});
		};
	}
	DefineController.$inject = ['$state', 'DefineService'];
})();
(function(){
	angular
		.module('workoutlog.auth.signin', ['ui.router'])
		.config(signinConfig);

		function signinConfig($stateProvider){
			$stateProvider
				.state('signin',{
					url: '/signin',
					templateUrl: '/components/auth/signin.html',
					controller: SignInController,
					controllerAs: 'ctrl',
					bindToController: this
				});
		}

		signinConfig.$inject = ['$stateProvider'];

		function SignInController($state, UsersService){
			var vm = this;
			vm.user = {};
			vm.login = function(){
				UsersService.login(vm.user).then(function(response){
					console.log(response);
					$state.go('define');
				});
			};
		}

		SignInController.$inject = ['$state', 'UsersService'];
})();
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
// this will be the js file that “powers” the custom directive

(function(){
	angular.module('workoutlog.logs', [
		'ui.router'
	])
	.config(logsConfig);

	logsConfig.$inject = ['$stateProvider'];
	function logsConfig($stateProvider){
		$stateProvider
			.state('logs',{
				url: '/logs',
				templateUrl: '/components/logs/logs.html',
				controller: LogsController,
				controllerAs: 'ctrl',
				bindToController: this,
				resolve: {
					getUserDefinitions: [
						'DefineService',
						function(DefineService){
							return DefineService.fetch();
						}
					]
				}
			})
			//  Notice in the .state(‘logs/update’) the ‘/:id’.  This is the variable that is passed to $stateParams.id. Notice on the .state(‘logs/update’) that there are two functions that occur on the resolve.  This allows the route to have access to the data of the log being edited.  Also note, that the resolve is getting all user definitions of a workout.
			.state('logs/update', {
				url: '/logs/:id', 
				templateUrl: '/components/logs/log-update.html',
				controller: LogsController,
				controllerAs: 'ctrl',
				bindToController: this,
				resolve: {
					getSingleLog: function($stateParams, LogsService){
						// $stateParams.id allows the application to pass the url and use that as a way to identify an individual workout.  Notice in the .state(‘logs/update’) the ‘/:id’.  This is the variable that is passed to $stateParams.id.
						return LogsService.fetchOne($stateParams.id);
					},
					getUserDefinitions: function(DefineService){
						return DefineService.fetch();
					}
				}
			});
	}

	LogsController.$inject = ['$state', 'DefineService', 'LogsService'];
	function LogsController($state, DefineService, LogsService){
		var vm = this;
		vm.saved = false;
		vm.log = {};
		vm.UserDefinitions = DefineService.getDefinitions();
		vm.updateLog = LogsService.getLog();
		vm.save = function(){
			LogsService.save(vm.log)
				.then(function(){
					vm.saved = true;
					$state.go('history');
				});
		};

		// create an update function here
		vm.updateSingleLog = function() {
			var logToUpdate = {
				id: vm.updateLog.id,
				desc: vm.updateLog.description,
				result: vm.updateLog.result,
				def: vm.updateLog.def
			}
			LogsService.updateLog(logToUpdate)
				.then(function(){
					$state.go('history');
				});
		};
	}
})();
(function(){
	angular.module('workoutlog')
		.factory('AuthInterceptor', ['SessionToken', 'API_BASE',
			function(SessionToken, API_BASE){
				return {
					request: function(config){
						var token = SessionToken.get();
						if (token && config.url.indexOf(API_BASE) > -1){
							// has config.headers - this is where the token that is generated on successful account creations(signup) and logging in (signin) are attached to each ajax request. The if statement above is essentially checking to see if there is a token and a url of API_BASE. Both of these are set in other files.
							config.headers['Authorization'] = token;
						}
						return config;
					}
				};
			}
		]);
	angular.module('workoutlog')
		// $httpProvider has an array that executes each interceptor that the Angular framework runs and also what a developer has custom built for specific applications.
		// $httpProvider are interceptors as methods to filter http requests
		.config(['$httpProvider', function($httpProvider){
			return $httpProvider.interceptors.push('AuthInterceptor');
		}
	]);
})();
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
					defineService.userDefinitions.unshift(response.data);
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
(function(){
	angular.module('workoutlog')
		.service('LogsService', LogsService);

		LogsService.$inject = ['$http', 'API_BASE'];
		function LogsService($http, API_BASE, DefineService){
			var logsService = this;
			logsService.workouts = [];
			logsService.individualLog = {};
			// saves the log
			logsService.save = function(log){
				return $http.post(API_BASE + 'log',{
					log: log
				}).then(function(response){
					logsService.workouts.push(response);
				});
			};

			logsService.fetch = function(log){
				return $http.get(API_BASE + 'log')
					.then(function(response){
						logsService.workouts = response.data;
					});
			};

			logsService.getLogs = function(){
				return logsService.workouts;
			};

			logsService.deleteLogs = function(log){
				var logIndex = logsService.workouts.indexOf(log);
				logsService.workouts.splice(logIndex, 1);
				var deleteData = {log: log};
				return $http({
					method: 'DELETE',
					url: API_BASE + "log",
					data: JSON.stringify(deleteData),
					headers: {"Content-Type": "application/json"}
				});
			};

			logsService.fetchOne = function(log){
				// console.log(log);
				return $http.get(API_BASE + 'log/' +log)
					.then(function(response){
						logsService.individualLog = response.data;
					});
			};

			logsService.getLog = function(){
				return logsService.individualLog;
			};

			logsService.updateLog = function(logToUpdate){
				return $http.put(API_BASE + 'log', {log: logToUpdate});
			}
		}
})();
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
// handles the http request to create and / or signin a user
(function(){
	angular.module('workoutlog')
		.service('UsersService', [
			'$http', 'API_BASE', 'SessionToken', 'CurrentUser',
			function($http, API_BASE, SessionToken, CurrentUser){
				function UsersService(){

				}
				UsersService.prototype.create = function(user){
					var userPromise = $http.post(API_BASE + 'user', {
						user: user
					});
					userPromise.then(function(response){
						SessionToken.set(response.data.sessionToken);
						CurrentUser.set(response.data.user);
					});
					return userPromise;
				};
				UsersService.prototype.login = function(user){
					var loginPromise = $http.post(API_BASE + 'login', {
						user: user
					})
					loginPromise.then(function(response){
						SessionToken.set(response.data.sessionToken);
						CurrentUser.set(response.data.user);
					})
					return loginPromise;
				};
			return new UsersService();
		}]);
})();
//# sourceMappingURL=bundle.js.map
