import request from 'request';
import qstring from 'query-string';
import Debug from 'debug';
var debug = Debug('Werk:Axio.js');

export default function(method, url, data, callback){
    var option      = {};
    option.url      = (window.location.origin + url);

    var ApiKey = (window.user && window.user.ApiKey)? window.user.ApiKey : 'xxx';

    method = option.method = method.toUpperCase();
    if(method=== 'POST' || method === 'PUT' || method === 'PATCH'){
        if(data) option.body = data;
    };

    option.json     = true;
    option.headers  = { Authorization: ApiKey };
    option.timeout  = 5000;
    request(option, function(err, response, body){
        var statusCode = (response && response.statusCode)? response.statusCode: 0;
        debug('REQUEST####', option);
        debug('STATUSCODE# ', statusCode);
        debug('RESPONSE### ', body);
        if(statusCode === 401) window.location.replace('/sign/in');
        else if(statusCode === 403) alert("Error: " + body);
        else if( statusCode === 500) alert('Error: ', body);
        
        return callback(err, body);
    });
};