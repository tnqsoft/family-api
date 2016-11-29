var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cors = require('cors');
var jwt = require('jsonwebtoken');
var configs = require('./configs');

//var index = require('./routes/index');
var users = require('./controllers/users');

var app = express();

// Set config---------------------------------------------------
app.set('secret', configs.secret);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
var rawBodySaver = function(req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}
app.use(bodyParser.json({
    verify: rawBodySaver
}));
app.use(bodyParser.urlencoded({
    verify: rawBodySaver,
    extended: true
}));
app.use(bodyParser.raw({
    verify: rawBodySaver,
    type: '*/*'
}));

// Check JWT----------------------------------------------------
// get an instance of the router for api routes
var apiRoutes = express.Router();
// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var tokenRegex = /^Bearer\s([a-zA-Z0-9\._\-\=]+)$/;
    var token = null;

    if (typeof req.headers['authorization'] !== 'undefined' && tokenRegex.test(req.headers['authorization'])) {
        var tokenPart = req.headers['authorization'].match(tokenRegex);
        token = tokenPart[1];
    } else {
        token = req.body.token || req.query.token;
    }

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('secret'), function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});
// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
// -------------------------------------------------------------

app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false,
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'doc')));

app.use(users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
