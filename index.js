
;(function () {
	var messageListener = function () {}
	addEventListener("message", function (e) {
		messageListener(e)
	}, false)

	get_github_access_token = function (scope, cb) {
		var state = 'x' + Math.random()
		messageListener = function (e) {
			if (e.data.indexOf(state) == 0) {
				cb(e.data.split(/,/)[1])
			}
		}
		var w = window.open('https://github.com/login/oauth/authorize?client_id=GITHUB_CLIENT_ID&scope=' + scope + '&state=' + state)
	}
})();
