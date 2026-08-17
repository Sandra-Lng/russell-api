require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catwaysRouter = require('./routes/catways');
var reservationsRouter = require('./routes/reservations');
var authRouter = require('./routes/auth');
var dashboardRouter = require('./routes/dashboard');
var checkJWT = require('./middlewares/checkJWT');
var mongodb = require('./db/mongo');

mongodb.initClientDbConnection();

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  express.static(path.join(__dirname, 'public'), {
    index: false
  })
);

app.use('/', indexRouter);
app.use('/', authRouter);

app.use('/dashboard', checkJWT, dashboardRouter);
app.use('/users', checkJWT, usersRouter);
app.use(
  '/catways/:id/reservations',
  checkJWT,
  reservationsRouter
);
app.use('/catways', checkJWT, catwaysRouter);

module.exports = app;