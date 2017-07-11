var express = require('express');
var router = express.Router();
var work = require('../Models/Work');
var secure = require('../Security').Secure;

function ToJson(res, err, result){
    if(err) return res.status(500).json({ message: err.message });
    else return res.status(200).json(result);
};

/**Fetch endpoint */
router.get('/user/:id', secure, function(req, res, next) {
    work.Fetch(req.params.id, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
});
/**Create endpoint */
router.post('/user', secure, function(req, res, next) {
    work.Create(req.body, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
})
/**Update endpoint */
router.patch('/user/:id', secure, function(req, res, next) {
    work.Update(req.params.id, req.body, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
})
/**Delete endpoint */
router.delete('/user/:id', secure, function(req, res, next) {
    work.Delete(req.params.id, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
})
/**List endpoint */
router.get('/user', secure, function(req, res, next) {
    work.List(req.params.query, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
})
/**Search endpoint */
router.post('/user/search', secure, function(req, res, next) {
    work.Search(req.params.query, req.user, function(err, result){
        ToJson(res, err, result );
    }); 
});

module.exports = router;
