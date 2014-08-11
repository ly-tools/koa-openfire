var raw = require('raw-body');
var xml2js = require('xml2js');
var _ = require('underscore');
var http = require('http');
var parser = new xml2js.Parser();
var dftCfg = {
	host: '127.0.0.1',
	port: 7070,
	path: '/http-bind/',
	method: 'POST',
	listen: '/JHB/'
};

function getBody(req) {
	req = req.req || req;
	var type = (req.headers['content-type'] || '').split(';')[0];
	if (type.indexOf('text/xml') !== -1 || type.indexOf('application/xml') !== -1) {
		return function(done) {
			raw(req, function(err, str) {
				if (err) return done(err);
				try {
					done(null, str.toString());
				} catch (err) {
					err.status = 400;
					err.body = str;
					done(err);
				}
			});
		};
	} else {
		return function(done) {
			var err = new Error('Unsupported or missing content-type');
			err.status = 415;
			done(err);
		};
	}
}

function boshRequest(ret, config) {
	var cache = "";
	return function(done) {
		var boshReq = http.request(config, function(boshRes) {
			boshRes.on('data', function(data) {
				data = data.toString();
				cache += data;
				parser.parseString(cache, function(err, result) {
					if (!err) {
						done(null, cache);
					}
				});
			});
		});
		boshReq.end(ret);
	};
}

module.exports = function(cfg) {
	var config = _.extend({}, dftCfg, cfg);
	return function * (next) {
		var self = this;
		if (self.path === config.listen) {
			var ret = yield getBody(this);
			this.body = yield boshRequest(ret, config);
			this.type = "text/xml";
			this.charset = "utf-8";
			yield next;
		} else {
			yield next;
		}
	};
};