import express from 'express'
import path from 'path'
import logger from 'morgan'
import { createWriteStream } from 'fs'
import { json, urlencoded } from 'body-parser'

var endpoints = require('./routes/endpoints')
var login_authorize = require('./routes/login_authorize')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

var access = path.join(__dirname, "access.log")
var accessLogStream = createWriteStream(access, {flags: 'a'})
app.use(logger('combined', {stream: accessLogStream}))
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
// app.use(cookieParser());
// app.use(express.static(join(__dirname, 'public')));

app.use('/', login_authorize)
app.use('/api', [endpoints])

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

global.baseDirectory = path.resolve(__dirname)
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
