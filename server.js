var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sample'
})

var app = express()

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'client')))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.post('/register', function (req, res) {
  let reg=req.body
  connection.query('call addUser(?, ?, ?, ?, ?)', [null, reg.fName, reg.lName, reg.email, reg.password], function (err, rows, fields) {
    if (!err) {
      res.send(rows[0])
    }else {
      res.send(err)
    }
  })
})

app.post('/login', function (req, res) {
  let log=req.body
  connection.query('call loginUser(?, ?)', [log.email, log.password], function (err, rows, fields) {
    if (!err) {
      res.send(rows[0])
    }else {
      res.send(err)
    }
  })
})
app.get('/listUsers', function (req, res) {
  connection.query('call GetUsers()', [], function (err, rows, fields) {
    if (!err) {
      res.send(rows[0])
    }else {
      res.send(err)
    }
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

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
