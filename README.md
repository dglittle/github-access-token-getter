github-access-token-getter
==========================

Lets web pages let users oauth into github without needing a server of their own. The oauth access token is given to the webpage itself. Use it like this:

```
<script src="//dglittle.github.io/github-access-token-getter/index.js"></script>
<script>

get_github_access_token('repo' /* scope */, function (access_token) {
	// make authenticated github API calls using access_token,
	// e.g. "https://api.github.com/user?access_token=" + access_token
})

</script>
```

commands to set it up on heroku:

```
heroku apps:create github-access-token-getter
vi index.js
	change GITHUB_ACCESS_TOKEN_GETTER_CLIENT_ID
heroku config:set GITHUB_CLIENT_SECRET=change_me

git push heroku +HEAD:master
```
