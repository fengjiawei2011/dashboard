
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , test = require('./routes/test')
  , upload = require('./routes/upload')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');
  
var accessLogfile = fs.createWriteStream('access.log', {flags : 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags : 'a'});
  
var app = express();

// all environments
app.use(express.logger({stream: accessLogfile}));

app.set('port', process.env.PORT || 7171);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.multipart());
//app.use(express.bodyParser({keepExtensions:true,uploadDir:path.join(__dirname,'/files'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.configure('production', function(){
	app.use(function(err,req,res,next){
		res.send(500, {error : 'something wrong!'})
		var meta = '[' + new Date() + ']' + req.url + '\n';
		errorLogfile.write(meta + err.stack + '\n');
		next();
	});
});

app.get('/t', test.testcase1);
app.get('/', routes.index);
app.get('/upload', upload.upload);
app.post('/upload/datafile', upload.datafile);
app.post('/upload/matedatafile', upload.matedatafile);
app.get('/users', user.list);
app.get('/test', test.testcase);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port %d in %s mode ' , app.get('port') , app.settings.env);
});
