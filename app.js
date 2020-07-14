var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');
const handlebars = require ('express-handlebars');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var newRouter = require('./routes/new');
var pessoaRouter = require('./routes/post/pessoa')
var mainRouter = require('./routes/main');
var pesquisapessoaRouter = require('./routes/post/pesquisapessoa')

var app = express();

//sessão
app.use(session({
  secret: 'fBYWN9YJhBSpll56SOlVsNzJAJ7qiSka',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())

//middleware
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg'),
  res.locals.error_msg = req.flash('error_msg'),
  next()
})

//bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({defaultLayout: 'layout'}));

//MongoDB
mongoose.connect("mongodb://localhost/terroir", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Conectado");
}).catch((err) => {
    console.log("Houve um erro ao se conectador ao mongoDB: " + err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/new', newRouter);
app.use('/main', mainRouter);
app.use('/criar-pessoa', pessoaRouter);
app.use('/pesquisa-pessoa', pesquisapessoaRouter);



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
