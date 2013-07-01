var http = require('http');
var	assert = require('assert');

var opts = {
	host: '127.0.0.1',
	port: 8000,
	path: '/send',
	method: 'POST',
	headers: {'content-type':'application/x-www-form-urlencoded'}
		
};

var req = http.request(opts, function(res) {
	
	res.setEncoding('utf8');
	
	
	var data = "";
	res.on('data', function(d) {
		data += d;
	});
	
	res.on('end', function() {
		assert.strictEqual(data, '{status:"ok", message:"Tweet received"}');
	});
	
	res.on('error', function(error) {
		console.log(error);
	});
	
});

req.write('tweet=test');
req.end();