/**
 * Job.js
 * @description Job instance management methods
 * @author Michael Grant<ulermod@gmail.com>
 * @date July 2017
 */
var debug= require('debug')('Werk:Model-Job');
var uuid = require('uuid');
var b = require('bcrypt-nodejs');
var moment = require('moment');
var sq = global.sq;
var DB = global.DB.collection('Job');
var Types = { 
    Remote:         'Remote', 
    DeskPlus:       'DeskPlus',
    TravelLite:     'TravelLite',
    TimeShift:      'TimeShift',
    MicroAgility:   'MicroAgility',
    PartTime:       'PartTime'
};
var States = { active: 'active', inactive: 'inactive' };

function QModifier(q){ return q};

/**
 * @description Creates a new user instances
 * @param {Object} Data
 * @param {Object} User
 * @param {Function} Callback
 * @return {Object} An object that defines the newly created user instance
 */
exports.Create = function(Data, User, Callback){
    try{
        debug('Create#input# ', Data);
        if(!Data) throw new Error("Input data is required!");      

        if(!Data.Title) throw new Error("Title is required!");
        if(!Data.Description) throw new Error("Description is required!");
        if(!Data.Location) throw new Error("Location is required!");

    }catch(exx){
        return Callback(exx);
    };

    var job        = {};
    job.Id         = uuid.v4();
    job.Created    = job.Modified = moment.utc().valueOf();
    job.State      = States.active;

    job.Type       = Data.Type;
    job.Title      = Data.Title;
    job.Description= Data.Description;
    job.Location   = Data.Location;
    
    DB.insert(job, function(err, result){
        debug('Create# ', err, result);
        if(!err && result){
            sq.PushEvent("New-Job-Created", job);
        };
        return Callback(err, job);
    });
};



/**
 * @description Fetches a user instance with a given ID
 * @param {String}
 * @param {Object}
 * @param {Function}
 * @return Returns fetched user object
 */
exports.Fetch = function(Id, User, Callback){
    try{
        if(!Id) throw new Error("Id is required!");
    }catch(exx){
        return Callback(exx);
    };
    DB.findOne({ Id: Id}, {}, function(err, user){
        debug('Fetch# ', err, user);
        return Callback(err, user);
    });
};


/**
 * @description Update
 * @param {String} Id
 * @param {Object} Data
 * @param {Object} User
 * @param {Function} Callback
 * @return Returns fetched user object
 */
exports.Update = function(Id, Data, User, Callback){
    try{
        if(!Id) throw new Error("Id is required!");
        if(!Data) throw new Error("Data is required!");
    }catch(exx){
        return Callback(exx);
    };

    var updata = { $set: {} };

    if(Object.keys(updata['$set']).length === 0 )
        return Callback( new Error("Nothing to update"));

    DB.findAndModify(
        { Id: Id},
        [['_id', 'desc']],
        updata,
        { new: true },
        function(err, user){
            debug('Update# ', err, user);
            return Callback(err, user);
        }
    );
};

/**
 * @description Delete
 * @param {String} Id
 * @param {Object} User 
 * @param {Function} Callback
 * @return Returns fetched user object
 */
exports.Delete = function(Id, User, Callback){
    try{
        if(!Id) throw new Error("Id is required!");
    }catch(exx){
        return Callback(exx);
    };
    DB.remove({ Id: Id}, function(err, user){
        debug('Delete# ', err, user);
        return Callback(err, user);
    });
};

/**
 * @description List
 * @param {Object} Query
 * @param {Object} User
 * @param {Function} Callback
 * @return Returns fetched user object
 */
exports.List = function(Query, User, Callback){
    try{
        debug('List#Input# ', Query);
        if(!Query) throw new Error("Query is required");
        if(Query.Page) Data.Page = ToInt(Query.Page);
        else Query.Page = 0;
    }catch(exx){
        return Callback(exx);
    };

    var Page    = parseInt(Query.Page || 0);
    var Prev    = (Page-1 < 0)? 0 : Page-1;
    var Next    = Page + 1;
    var Limit   = 10;
    var Options = { limit: Limit, skip: ( (Page * Limit) || 0), sort: [['_id', 'desc']] };
    
    var Q = {};

    DB.count( QModifier(Q, User), function(err, size){
        DB.find( QModifier(Q, User), {}, Options ).toArray(function(err, result){
            debug('List#Output# ', err, size);
            if((Page*Limit) >= size) Next = Page;
            var NoPages = Math.ceil(size/Limit);
            return Callback(err, { items: result, size:size, page: Page, prev: Prev, next: Next, nopages: NoPages } );
        });
    });
};

/**
 * @description Search
 * @param {String}
 * @param {Object}
 * @param {Function}
 * @return Returns fetched user object
 */
exports.Search = function(Query, User, Callback){
    try{
        debug('Search#Input# ', Data);
        if(!Query) throw new Error("Data is required");
        ValType.Required( Query.SearchText, "SearchText is required");
        if(Query.Page) Query.Page = ToInt(Query.Page);
        else Query.Page = 0;
    }catch(exx){
        return Callback(exx);
    };

    var Page    = parseInt(Data.Page || 0);
    var Prev    = (Page-1 < 0)? 0 : Page-1;
    var Next    = Page + 1;
    var Limit   = 10;
    var Options = { limit: Limit, skip: ( (Page * Limit) || 0), sort: [['_id', 'desc']] };
    

    var Q                               = {};
    Q['$text']                          = {};
    Q['$text']['$search']               = Data.SearchText;
    Q['$text']['$caseSensitive']        = false;
    Q['$text']['$diacriticSensitive']   = false;

    DB.count( QModifier(Q, User), function(err, size){
        DB.find( QModifier(Q, User), {}, Options ).toArray(function(err, result){
            debug('Search#Output# ', err, size);
            if((Page*Limit) >= size) Next = Page;
            var NoPages = Math.ceil(size/Limit);
            return Callback(err, { items: result, size:size, page: Page, prev: Prev, next: Next, nopages: NoPages, SearchText: Data.SearchText  });
        });
    });
};