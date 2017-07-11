var debug = require('debug')('Werk:Connection');
var MongoClient = require('mongodb').MongoClient;
var deasync = require('deasync');
var config = global.config;


var done = false;
var options = {};
var Callback = function(err, indexname) {  
    debug(null, err, indexname); 
};

module.exports = function(){
    MongoClient.connect(config.MONGO_URL, options, function(err, db){
        done = true;
        debug('MongoDB connection status: ', err);
        global.DB = db;
        if(err) throw err;

        /**Setup Indexes */
        db.ensureIndex("Work", {  Title: "text", Description:"text" }, Callback );
        db.ensureIndex("User", {  Firstname: "text", Lastname:"text", Email: "text"}, Callback );

    });

    deasync.loopWhile(function(){ return !done; });
};