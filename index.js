var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/modules', express.static(path.join(__dirname, '../node_modules/')));

app.listen(3000, () => console.log('App listening on port 3000'));