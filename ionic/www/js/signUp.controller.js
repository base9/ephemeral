angular.module('radar')
.controller('SignUpController', ['$http', function(http) {

	this.signInWithFacebook = function() {
		OAuth.initialize('L3_Da00cNGJ1srYmK7TIzzMyWjI');
		OAuth.popup('facebook')
			.done(function(result) {
				console.log("OAUTH SUCCESS", result);
				result.get('https://graph.facebook.com/me?access_token=' + result.access_token)
				.then(function(userInfo) {
					console.log(userInfo);
				})
			})
			.fail(function(result) {
				console.log("OAUTH FAILED");
			})
	}
	this.signInWithGoogle = function() {
		OAuth.initialize('L3_Da00cNGJ1srYmK7TIzzMyWjI');
		OAuth.popup('google')
			.done(function(result) {
				console.log("OAUTH SUCCESS", result);
				result.get('https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=' + result.id_token)
				// result.get('https://www.googleapis.com/plus/v1/people/me?access_token=' + result.access_token) 
				.then(function(userInfo) {
					console.log(userInfo)
				})
			})
			.fail(function(result) {
				console.log("OAUTH FAILED");
			})
	}
	this.login = function() {
		// http.post()
	}
	// this.signup = function() {
	// 	http.post('/auth/signup', )
	// }

}]);