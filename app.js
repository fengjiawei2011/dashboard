
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , test = require('./routes/test')
  , upload = require('./routes/upload')
  , http = require('http')
  , path = require('path');
  
  
  
var app = express();

// all environments
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

app.get('/t', test.testcase1);
app.get('/', routes.index);
app.get('/upload', upload.upload);
app.post('/upload/datafile', upload.datafile);
app.post('/upload/matedatafile', upload.matedatafile);
app.get('/users', user.list);
app.get('/test', test.testcase);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
