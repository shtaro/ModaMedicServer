var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyparser = require('body-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var questionnairesRouter = require('./routes/questionnaires');
var metricsRouter = require('./routes/metrics');
var answersRouter = require('./routes/answers');

var app = express();

app.use(bodyparser.urlencoded({
  extended: true
}));

var mongoose = require('mongoose');

//Set up default mongoose connection
//var mongoDB = "mongodb+srv://shtaro:turAYR3011@cluster0-lk8r9.mongodb.net/test?retryWrites=true&w=majority";
var mongoDB = "mongodb://localhost:27017/modamedicDB";
mongoose.connect(mongoDB,  { useNewUrlParser: true });
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
db.once('open', function (err) {
  if (!err)
    console.log("connected to mongo db");
  else
    console.log("failed");
});
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questionnaires', questionnairesRouter);
app.use('/metrics', metricsRouter);
app.use('/answers', answersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;


