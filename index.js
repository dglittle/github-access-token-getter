
;(function () {
	GITHUB_ACCESS_TOKEN_GETTER_CLIENT_ID = 'cd5e44dfd93193f76da9'

	var messageListener = null
	get_github_access_token = function (scope, cb) {
		var state = 'x' + Math.random()
		if (!messageListener)
			addEventListener("message", function (e) {
				messageListener(e)
			}, false)
		messageListener = function (e) {
			if (e.data.indexOf(state) == 0)
				cb(e.data.split(/,/)[1])
		}
		var w = window.open('https://github.com/login/oauth/authorize?client_id=' + GITHUB_ACCESS_TOKEN_GETTER_CLIENT_ID + '&scope=' + scope + '&state=' + state)
	}
})();
