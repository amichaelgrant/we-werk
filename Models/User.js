/**
 * User.js
 * @description Contains user related functions for managing user instances across
 * the entire application
 * @author Michael Grant<ulermod@gmail.com>
 * @date July 2017
 */
var debug= require('debug')('Werk:Model-User');
var uuid = require('uuid');
var moment = require('moment');
var b = require('bcrypt-nodejs');
var sq = global.sq;
var DB = global.DB.collection('User');
var Types = { individual: 'individual', organisation: 'organisation'};
var States = { active: 'active', inactive: 'inactive' };



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
        if(!Data.Type) throw new Error("Type is required!");
        if(!Types[Data.Type]) throw new Error("Type must contain a valid value!");

        if(!Data.Email) throw new Error("Type is required!");
        if(!Data.Password) throw new Error("Type is required!");
        if(!Data.Firstname) throw new Error("Type is required!");
        if(!Data.Lastname) throw new Error("Type is required!");

        if(Data.Type === Types.individual){
            if(!Data.LinkedInUrl) throw new Error("LinkedInUrl is required!");
            if(!Data.MostRecentEmployer) throw new Error("MostRecentEmployer is required!");
            if(!Data.HighestEducationReceived) throw new Error("HighestEducationReceived is required!");
        }else if(Data.Type === Types.organisation){
            if(!Data.CompanyName) throw new Error("CompanyName is required!");
            if(!Data.Title) throw new Error("Title is required!");
            if(!Data.PhoneNumber) throw new Error("PhoneNumber is required!");
        }
    }catch(exx){
        return Callback(exx);
    };


    var user        = {};
    user.Id         = uuid.v4();
    user.Created    = user.Modified = moment.utc().valueOf();
    user.State      = States.active;

    user.Type       = Data.Type;
    user.Email      = Data.Email;
    user.Password   = b.hashSync(Data.Password);
    user.Firstname  = Data.Firstname;
    user.Lastname   = Data.Lastname;
    if(Data.Type === Types.individual){
        user.LinkedInUrl                = Data.LinkedInUrl;
        user.MostRecentEmployer         = Data.MostRecentEmployer;
        user.HighestEducationReceived   = Data.HighestEducationReceived;
    }else if(Data.Type === Types.organisation){
        user.CompanyName                = Data.CompanyName;
        user.Title                      = Data.Title;
        user.PhoneNumber                = Data.PhoneNumber;
    };

    DB.insert(user, function(err, result){
        debug('Create# ', err, result);
        if(!err && result){
            sq.PushEvent("New-User-Created", user);
        };
        return Callback(err, user);
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
        debug('List#Input# ', Data);
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


/**
 * @description Initiates Password reset sequence
 * @param {String}
 * @param {Object}
 * @param {Function}
 * @return Returns fetched user object
 */
exports.ResetPassword = function(Data, User, Callback){
    try{
        if(!Data) throw new Error("Data is required!");
        if(!Data.Email) throw new Error("Email is required!");
    }catch(exx){
        return Callback(exx);
    };
    DB.findAndModify(
        { Email: Data.Email }, 
        [['_id', 'desc']],
        {
            $set: { 
                ResetInitiated: moment.utc().valueOf(),
                ResetId : uuid.v4()
            }
        },
        { new : true },
        function(err, user){
            debug('ResetPassword# ', err, user);
            if(!err && user && user.value){
                sq.PushEvent('Password-Reset-Initiated', user.value);
            };
            return Callback(err, user);
        }
    );
};
/**
 * @description Uses reset id to fetch and user instance for processing
 * @param {String}
 * @param {Object}
 * @param {Function}
 * @return Returns fetched user object
 */
exports.ProcessResetPassword = function(Id, User, Callback){
    try{
        if(!Id) throw new Error("Id is required!");
    }catch(exx){
        return Callback(exx);
    };
    DB.findOne(
        { ResetId: Id}, 
        {},
        function(err, user){
            debug('ProcessResetPassword# ', err, user);
            return Callback(err, user);
        }
    );
};
/**
 * @description Final stage of password reset
 * @param {Object}
 * @param {Object}
 * @param {Function}
 * @return Returns fetched user object
 */
exports.DoActualResetPassword = function(Data, User, Callback){
    try{
        if(!Data) throw new Error("Data is required!");
        if(!Data.Email) throw new Error("Email is required!");
        if(!Data.Password) throw new Error("Password is required!");
    }catch(exx){
        return Callback(exx);
    };
    DB.findAndModify(
        { Email:  Data.Email }, 
        [['_id', 'desc']],
        { 
            $set: {
                Password: b.hashSync(Data.Password),
                ResetId : null,
                ResetCompleted: moment.utc().valueOf()
            }
        },
        {new: true},
        function(err, user){
            debug('DoActualResetPassword# ', err, user);
            if(!err && user && user.value){
                sq.PushEvent("Password-Reset-Completed", user.value);
            };
            return Callback(err, user);
        }
    );
};