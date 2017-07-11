/**
 * Security.js
 * @description Site security functions
 */
var debug = require('debug')('Werk:Security');


/**
 * @description Ensures users are logged in to access whatever resource they are trying
 * to access;
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.Secure = function(req, res, next){
    debug('Secure# ', res.status);
    if(!req.isAuthenticated()) return res.status(401).render('Sign.In.ejs', { title: 'Sign In'});
    else return next();
};