
;(function () {
	var messageListener = function () {}
	addEventListener("message", function (e) {
		messageListener(e)
	}, false)

	get_github_access_token = function (scope, cb) {
		$.get('https://github-access-token-getter.herokuapp.com/client_id', function (client_id) {
			var state = 'x' + Math.random()
			messageListener = function (e) {
				if (e.data.indexOf(state) == 0) {
					cb(e.data.split(/,/)[1])
				}
			}
			window.open('https://github.com/login/oauth/authorize?client_id=' + client_id + '&scope=' + scope + '&state=' + state).focus()
		})
	}
})();
