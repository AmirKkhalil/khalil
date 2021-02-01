var createError = require('http-errors');
var express = require('express');

var logger = require('morgan');

const cors = require('cors');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productsRouter = require('./routes/products'); //
const ordersRouter = require('./routes/orders'); //

var app = express();

// cors 
app.use(cors());

app.use(logger('dev'));

// database mongodb 
mongoose.connect('mongodb://localhost/Shopping-API', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(err)
        return
    } else {
        console.log('connecting to DB')
    }
});

// activer le bodyParser qui se trouve dans express 
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

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
    res.json({ error: err.message });
});

module.exports = app;