(function(){
	var app = angular.module('workoutlog',[
		'ui.router',
		'workoutlog.define',
		'workoutlog.logs',
		'workoutlog.history',
		'workoutlog.feed',
		'workoutlog.auth.signup',
		'workoutlog.auth.signin'
	])
	.factory('socket', function(socketFactory){
		var myIoSocket = io.connect('http://localhost:3000');
		var socket = socketFactory({
			ioSocket: myIoSocket
		});
		return socket;
	});
	function config($urlRouterProvider){
		$urlRouterProvider.otherwise('/signin');
	}
	// $inject: directive form angular to inject dependecies
	config.$inject = ['$urlRouterProvider'];
	app.config(config);
	// var API_BASE is now dynamic and the WorkoutLog-Angular can run deployed or locally because the ternary operator determines the environment and alters the API_BASE accordingly
	var API_BASE = location.hostname === "localhost" ?
		"//localhost:3000/api/" : "//gutbuster-api.herokuapp.com/api/";
	app.constant('API_BASE', API_BASE);
})();