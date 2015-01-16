
get_github_access_token = function (scope, cb) {
	$.get('https://github-access-token-getter.herokuapp.com/client_id', function (client_id) {
		var state = _.randomString(20)
		window.get_github_access_token_callback = function (access_token) {
			cb(access_token)
		}
		var w = window.open('https://github.com/login/oauth/authorize?client_id=' + client_id + '&scope=' + scope + '&state=' + state, 'github','height=500,width=1024')
		if (window.focus) w.focus()
	})
}
