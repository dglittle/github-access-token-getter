
var _ = require('gl519')

_.wget = function (method, url, params, encoding, extraHeaders) {
    if (method && method.match(/:/)) {
        return _.wget.apply(null, [null].concat(_.toArray(arguments)))
    }
    
    url = require('url').parse(url)
    
    var o = {
        method : method || (params ? 'POST' : 'GET'),
        hostname : url.hostname,
        path : url.path
    }
    if (url.port) o.port = url.port
    if (url.auth) o.auth = url.auth

    o.headers = {}
    o.headers["User-Agent"] = "gl519/1.0"
    if (!o.method.match(/^get$/i)) {
        if (!params) {
            var data = ""
        } else if (typeof(params) == 'string') {
            var data = params
        } else {
            var data = _.values(_.map(params, function (v, k) { return k + "=" + encodeURIComponent(v) })).join('&')
        }
        o.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8"
        o.headers["Content-Length"] = Buffer.byteLength(data, 'utf8')
    }
    _.each(extraHeaders, function (v, k) {
        o.headers[k] = v
    })
    
    var r = require(url.protocol.replace(/:/, '')).request(o, _.p())
    if (data)
        r.end(data, 'utf8')
    else
        r.end()
    var res = _.p()
    var ret = _.consume(res, encoding)
    _.wget.res = res
    return ret
}
