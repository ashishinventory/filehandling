
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var fs = require("fs");
var mime = require('mime');

var bodyParser = require('body-parser');
var multer  = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
// This code use for upload file on node server.
// Request start here.
app.post('/file_upload', function (req, res) {

	   console.log(req.files.file.name);
	   console.log(req.files.file.path);
	   console.log(req.files.file.type);

	   var file = __dirname + '/uploadData/' + req.files.file.name;
	   console.log(file);
	   fs.readFile( req.files.file.path, function (err, data) {
	        fs.writeFile(file, data, function (err) {
	        	console.log(data);
	         if( err ){
	              console.log( err );
	         }else{
	               response = {
	                   message:'File uploaded successfully',
	                   filename:req.files.file.name
	              };
	          }
	          console.log( response );
	          res.end( JSON.stringify( response ) );
	       });
	   });
	})
	// End here.
// Code download code from server.
	app.get('/download', function(req, res){

  var file = __dirname + '/uploadData/IMG_20150623_121254.jpg';

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
});
// end here
app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
