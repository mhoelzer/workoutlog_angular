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