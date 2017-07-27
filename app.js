(function(){
	var app = angular.module('workoutlog',[
		'ui.router',
		'workoutlog.auth.signup',
		'workoutlog.auth.signin',
		'workoutlog.define',
		'workoutlog.logs',
		'workoutlog.history'
	])
	.factory('socket', function(socketFactory){
		var myIoSocket = io.connect('http://localhost:3000');
		var socket = socketFactory({
			ioSocket: myIoSocket
		})
		return socket;
	});
	function config($urlRouterProvider){
		$urlRouterProvider.otherwise('/signin');
	}
	// $inject: directive form angular to inject dependecies
	config.$inject = ['$urlRouterProvider'];
	app.config(config);
	var API_BASE = location.hostname === "localhost" ?
		"//localhost:3000/api/" : "workoutlogangular-mh.herokuapp.com"
	app.constant('API_BASE', API_BASE);
})();