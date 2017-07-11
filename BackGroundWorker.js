/**
 * @description
 * This script runs all system CPU intensive tasks in a seperate process
 * so as to avoid hanging the UI process  of the system
 * It essentially fetches data from a simple queue backed by redis lists for processing
 * If data integrity  is of importance then we will have to replace redis with some persistant form 
 * of a queue like say...RabbitMQ or whatever
 * This might require a slight modification to both the event pusher and worker.
 * @author Michael Grant <ulermod@gmail.com>
 * @date July 2017
 */
var debug = require('debug')('Werk:BackGroundWorker');
var redis = require('redis');
var uuidv4= require('uuid').v4;
var nodemailer = require('nodemailer');
var config= require('./Configuration');

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    posrt: 465,
    secure: true,
    auth: { user: config.SMTP_USER, pass: config.SMTP_PASS }
});

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
        fetchAndProcess();
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
        debug('parseMessage# ', exx);
        return null;
    };
};

function stringifyMessage(o){
    try{
        return JSON.stringify(o);
    }catch(exx){
        debug('stringifyMessage# ', exx);
        return o;
    };
};

function sendEmailEvent(subject, text, event, callback){
    var mail = {};
    mail.from = config.SMTP_CONTACT + " <" + config.SMTP_FROM+ ">";
    mail.to   = event.Email;
    mail.subject = subject;
    mail.text = text;
    transporter.sendMail(mail, function(err, info){
        debug('Transporter# ', err, info);
        return callback(err, info);
    });
};

var sq = new SimpleQueue();
var ev = {};
ev['New-User-Created'] = 'New-User-Created';
ev['Password-Reset-Completed'] = 'Password-Reset-Completed';

var tx  = {
    'New-User-Created' : {
        Subject: "Welcome",
        Body   : "Welcome to Werk"
    },
    'Password-Reset-Initiated': {
        Subject: "Password Reset Requested",
        Body   : "You have initiated a password reset"
    },
    'Password-Reset-Completed': {
        Subject: "Password Reset Successful",
        Body   : "Your password has been reset successfully"
    }
};

function fetchAndProcess(){
    sq.io.blpop("EVENT-QUEUE", 0, function(err, result){
        debug('fetchAndProcess# ', err, result);

        if(err) return fetchAndProcess();
        if(!result) return fetchAndProcess();
        if(!Array.isArray(result)) return fetchAndProcess();
        if(result.length !== 2) return fetchAndProcess();
        if(result[0] !== 'EVENT-QUEUE') return fetchAndProcess();
        result = result[1];
        var data = parseMessage(result);
        if(!data) return fetchAndProcess();
        debug('parsedData# ', data);
        if(
            (ev['New-User-Created'] === data.Event) ||
            (ev['Password-Reset-Completed'] === data.Event) 
        ){
            var subject = tx[data.Event].Subject;
            var body    = tx[data.Event].Body;
            return sendEmailEvent(subject, body, data, function(err, result){
                return fetchAndProcess();
            });
        }
        else return fetchAndProcess();
    });
};


fetchAndProcess();