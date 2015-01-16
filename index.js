
get_github_access_token = function (scope, cb) {
	$.get('https://github-access-token-getter.herokuapp.com/client_id', function (client_id) {
		var state = _.randomString(20)

		var func = function (event) {
			if (event.origin != 'https://github-access-token-getter.herokuapp.com') return
			removeEventListener("message", func, false)
			var o = _.unJson(event.data)
			if (state != o.state) throw 'evil is amok'
			cb(o.access_token)
		}
		addEventListener("message", func, false)

		var w = window.open('https://github.com/login/oauth/authorize?client_id=' + client_id + '&scope=' + scope + '&state=' + state, 'github','height=500,width=1024')
		if (window.focus) w.focus()
	})
}
