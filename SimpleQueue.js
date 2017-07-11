var debug = require('debug')('Werk:SimpleQueue');
var redis = require('redis');
var uuidv4= require('uuid').v4;
var config= global.config;

var HOSTID    = ( config.REDIS_HOST    || '127.0.0.1' );
var PORTID    = ( config.REDIS_PORT    || 6379 );


function SimpleQueue(flow, fnCallback){
    var options = {};
    options.port = PORTID;
    options.host = HOSTID;
    options.socket_keepalive = true;
    options.enable_offline_queue = true;
    options.retry_strategy = function(opt){
        if(opt.attempt > 10){
            return new Error("Too many retries to redis!");
        };

        /**Every 7 milliseconds */
        return (7 * 1000);
    };

    /**Setup redis client */
    this.io = new  redis.createClient(options);
    this.io.on('error', function(err){
        debug('Error: ', err);
    });
    this.io.on('ready', function(){
        debug('Connection ready!');
    });
    this.io.on('connect', function(){
        debug('Connected!');
    });
    this.io.on('reconnecting', function(){
        debug('Reconnecting!');
    });
    this.io.on('end', function(){
        debug('Connection ended!');
    });

};

function parseMessage(str){
    try{
        return JSON.parse(str);
    }catch(exx){
        return null;
    };
};

function stringifyMessage(o){
    try{
        return JSON.stringify(o);
    }catch(exx){
        return o;
    };
};



SimpleQueue.prototype.PushEvent = function(Event, Data, Callback){
    var data = (Data || {});
    data.Event = Event;
    this.io.rpush("EVENT-QUEUE", stringifyMessage(Data));
};  


module.exports = SimpleQueue;