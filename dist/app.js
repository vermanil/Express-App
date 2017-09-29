'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var favicon = require('serve-favicon');
var index = require('./routes/index');
// var cookieParser = require('cookie-parser');

var users = require('./routes/users');

var app = (0, _express2.default)();

// view engine setup
app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use((0, _morgan2.default)('dev'));
app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;