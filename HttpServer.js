var debug = require('debug')('Werk:HttpServer');
global.config = require('./Configuration');
require('./Connection')();
global.sq = new ( require('./SimpleQueue'));
var express = require('express');
var b = require('bcrypt-nodejs');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Redis = require('connect-redis')(session);
var flash = require('connect-flash');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = global.DB.collection('User');

/**Passport */
passport.use( new localStrategy(
    {
        usernameField: 'Email',
        passwordField: 'Password',
        passReqToCallback: true,
    }, 
    function(req, Email, Password, done){
        debug('localStrategy==>', Email, Password);
        User.findOne({ Email: Email }, function(err, user){
            debug('localStrategy#findOne==>', err, user);
            if(err ) return(err);
            if(!user) return done(null, false, new Error('Incorrect user credentials!'));
            if(b.compareSync(Password, user.Password)){
                return done(null, user);
            }else return done(null, false, new Error('User not found!'));
        });
    }
));
passport.serializeUser(function(user, done){
    return done(null, user.Id);
});
passport.deserializeUser(function(id, done){
    User.findOne({Id: id, }, function(err, user){
        return done(err, user);
    });
});
/**End Passport */


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'Public')));

app.use(session({
    store: new Redis(),
    saveUninitialized: false,
    resave: false,
    secret: 'secret-code', 
    cookie: { maxAge: 1 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    if(!req.session) return next(new Error('Oops! session not available!'));
    else return next();
});


app.use('/',  require('./Routes/Index'));
var router = express.Router();
router.post('/sign/in', function(req,res,next){
    debug('Sign/In# ', req.body);
    return next();
}, passport.authenticate('local', { failureRedirect: '/sign/in'}), 
function(req, res, next){
    debug('Sign in successfull!');
    return res.redirect('/account');
});
app.use('/', router);

app.use('/',  require('./Routes/User'));
app.use('/',  require('./Routes/Work'));


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('Error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('Error', {
        message: err.message,
        error: {}
    });
});


app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});