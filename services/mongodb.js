const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');

// Connection URL


// Use connect method to connect to the Server
const initialize = function(){
    return new Promise((resolve,reject)=>{
        const url = 'mongodb://localhost:27017';
        const dbName = 'taxi';
        const client = new MongoClient(url,{useNewUrlParser:true});

        client.connect(async function(err, client) {
            if(err)
                return reject(err);
            return resolve(client.db(dbName));
                
        });
    })
    
}

module.exports.initialize = initialize;
