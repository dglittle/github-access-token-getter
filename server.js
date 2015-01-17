
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

    var indexJs = null
    app.get('/index.js', function (req, res) {
        _.run(function () {
            if (!indexJs) indexJs = _.p(require('fs').readFile(require('path').join(__dirname, 'index.js'), { encoding : 'utf8' }, _.p())).replace(/GITHUB_CLIENT_ID/g, process.env.GITHUB_CLIENT_ID)
            res.writeHead(200, {
                'Content-Type': 'application/javascript; charset=utf-8',
                'Content-Length': Buffer.byteLength(indexJs)
            })
            res.end(indexJs)
        })
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

                body = '<script>window.opener.postMessage("' + q.state + ',' + access_token + '", "*"); window.close()</script>'
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
