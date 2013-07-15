var request = require('request'),
    cheerio = require('cheerio'),
	express = require('express');

var app = express();
app.listen(8000);
app.configure(function(){
	app.set("view options",{layout: false});
	app.set('view engine', 'ejs');
	app.use(express.cookieParser());
	app.use(express.session({secret: '1234567890QWERTY'}));
});

var google = 'https://www.google.com/searchbyimage';
var image;
var $;



app.get('/', function(req, res) {
	
	var title = 'ReverseSearchNode';

	res.render('index', {
		
		locals:{
			'title':title,
			stylesheets:['/public/style.css']
		}
		
	});
	
});

app.get('/result', function(req, res) {
	
	var title = 'ReverseSearchNode';

	res.render('result', {
		
		locals:{
			'title':title,
			'result':req.session.result,
			stylesheets:['/public/style.css']
		}
		
	});
	
});

app.post('/send', express.bodyParser(), function(req, res) {
	
	if(req.body && req.body.image_url) {
		
		var options = {
				  url: google,
				  qs: { image_url: req.body.image_url },
				  headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11' }
		};

		request(options, function (err, resp, body) {
			
			$ = cheerio.load(body);
			req.session.result = findGuess($);
			res.redirect('/result',302);
		});		
		
		
	} else {
		res.send({status:"nok",message:"No url received"});
	}
	
});

function findGuess($) {
	
	////*[@id="topstuff"]/div[3]/a

	var result = $('#topstuff').find('div').next().next().find('a').html();
	console.log(result);
	
	return result;
	
}
