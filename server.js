
process.on('uncaughtException', function (err) {
    try {
        console.log(err)
        console.log(err.stack)
    } catch (e) {}
})

var _ = require('gl519')
require('./server_utils.js')
try { require('./_config.js') } catch (e) {}

_.run(function () {
    if (!process.env['PORT']) process.env['PORT'] = 5000
    if (!process.env['NODE_ENV']) process.env['NODE_ENV'] = 'production'

    var express = require('express')
    var app = express()

    _.serveOnExpress(express, app)

    app.use(function (req, res, next) {
        _.run(function () {
            req.body = _.consume(req)
            next()
        })
    })

    app.get('/', function (req, res) {
        res.sendFile(require('path').join(__dirname, 'index.html'))
    })

    app.get('/index.js', function (req, res) {
        res.sendFile(require('path').join(__dirname, 'index.js'))
    })

    app.all(/\/client_id/, function (req, res) {
        corsSend(req, res, process.env.GITHUB_CLIENT_ID)
    })

    app.all(/\/oauth/, function (req, res, next) {
        _.run(function () {
            try {
                var q = require('url').parse(req.url, true).query

                var access_token = _.unJson(_.wget('https://github.com/login/oauth/access_token', {
                    client_id : process.env.GITHUB_CLIENT_ID,
                    client_secret : process.env.GITHUB_CLIENT_SECRET,
                    code : q.code
                }, null, {
                    'Accept' : 'application/json'
                })).access_token

                body = '<script>window.opener.postMessage("' + _.escapeString(_.json({
                        access_token : access_token,
                        state : q.state
                    })) + '", "*"); window.close()</script>'
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Content-Length': Buffer.byteLength(body)
                })
                res.end(body)
            } catch (e) {
                next(e)
            }
        })
    })

    app.use(require('errorhandler')({
        dumpExceptions: true,
        showStack: true
    }))

    app.listen(process.env['PORT'], function() {
        console.log('go to http://localhost:' + process.env['PORT'])
    })
})
