const dbo = require('./mongodb')
const Promise = require('bluebird')
const Boom = require('boom');

async function init(){
    db = await dbo.initialize();
}

 const logData=(adminID,driverID)=>{
    return new Promise((resolve,reject)=>{
        db.collection('log').insertOne({"admin_id":adminID,"driver_id":driverID,"date":Date()},function(err,data){
            if(err){
                return reject(Boom.badImplementation("Implementation error").output.payload);
            }
            resolve(data);
        });
    })
    
}

const addCompletionTime = (driverID)=>{
    return new Promise((resolve,reject)=>{
        db.collection('log').updateOne({"driver_id":driverID},{$set:{"completion_time":Date()}},{upsert:false},function(err,data){
            if(err){
                return reject(Boom.badImplementation("Implementation error").output.payload);
            }
            resolve(data);
        })
    })
}

module.exports.init = init;
module.exports.logData = logData;
module.exports.addCompletionTime = addCompletionTime;

