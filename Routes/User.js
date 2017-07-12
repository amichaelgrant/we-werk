/**
 * User.js
 * @author Michael Grant <ulermod@gmail.com>
 * @date July 2017
 */
var express = require('express');
var router = express.Router();
var user = require('../Models/User');
var secure = require('../Security').Secure;

function ToJson(res, err, result){
    if(err) return res.status(200).json({ message: err.message });
    else return res.status(200).json(result);
};

/**Fetch endpoint */
router.get('/user/:id', secure, function(req, res, next) {
    user.Fetch(req.params.id, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
});
/**Create endpoint */
router.post('/user', function(req, res, next) {
    user.Create(req.body, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
})
/**Update endpoint */
router.patch('/user/:id', secure, function(req, res, next) {
    user.Update(req.params.id, req.body, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
})
/**Delete endpoint */
router.delete('/user/:id', secure, function(req, res, next) {
    user.Delete(req.params.id, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
})
/**List endpoint */
router.get('/user', secure, function(req, res, next) {
    user.List(req.params.query, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
})
/**Search endpoint */
router.post('/user/search', secure, function(req, res, next) {
    user.Search(req.params.query, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
});

module.exports = router;
