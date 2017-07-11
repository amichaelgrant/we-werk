var express = require('express');
var debug  = require('debug')('Werk-Index');
var router = express.Router();
var user = require('../Models/User');
var secure = require('../Security').Secure;

/** Index*/
router.get('/', function(req, res, next) {
  res.render('Index', { title: 'Home-Werk' });
});

/** */
router.get('/account', secure, function(req, res, next) {
  res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.render('Account', { title: 'My Account' });
});
router.get('/account/session', secure, function(req, res, next){
  return res.json(req.user);
});

/** */
router.get('/for/employers', function(req, res, next) {
  res.render('For.Employers.ejs', { title: 'For Employers' });
});
router.get('/join/werk', function(req, res, next) {
  res.render('Join.Werk.ejs', { title: 'Join Werk' });
});
router.post('/join/werk', function(req, res, next) {
  user.Create(req.body, null, function(err, result){
    debug('Create#join#werk# ', err, result);
    if(err)
      return res.render('Join.Werk.ejs', { title: 'Join Werk',error: err });
    else{
      req.logIn(result, function(err){
        if(err) return res.render('Join.Werk.ejs', { title: 'Join Werk',error: err });
        else return res.redirect('/account');
      });
    }
  });
});
router.get('/sign/in', function(req, res, next) {
  res.render('Sign.In.ejs', { title: 'Sign In' });
});
router.get('/join/employer', function(req, res, next) {
  res.render('Join.Employer.ejs', { title: 'Join Employer' });
});
router.post('/join/employer', function(req, res, next) {
  user.Create(req.body, null, function(err, result){
    debug('Create#join#employer# ', err, result);
    if(err)
      return res.render('Join.Employer.ejs', { title: 'Join Employer', error: err });
    else{
      req.logIn(result, function(err){
        if(err) return res.render('Join.Employer.ejs', { title: 'Join Employer', error: err });
        else return res.redirect('/account');
      });
    };

  }); 
});


/** */
router.get('/terms/of/use', function(req, res, next) {
  res.render('Terms.Of.Use.ejs', { title: 'Terms of Use' });
});
router.get('/privacy/policy', function(req, res, next) {
  res.render('Privacy.Policy.ejs', { title: 'Privacy Policy' });
});

/** */
router.get('/forgot/password', function(req, res, next) {
  res.render('Forgot.Password.ejs', { title: 'Forgot Password' });
});
router.post('/forgot/password', function(req, res, next) {
  user.ResetPassword(req.body, null, function(err, result){
    return res.render('Forgot.Password.ejs', { title: 'Forgot Password', error: err });
  });
});

/** */
router.get('/logout', secure, function(req, res, next) {
  req.logOut();
  req.session.destroy(function(err){
    debug('logout# ', err);
    return res.redirect('/');
  });
});


module.exports = router;
