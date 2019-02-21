/**
 *  All queries related to mongo db database are written in this file.
 */

const dbo = require('./mongodb')
const Promise = require('bluebird')
const Boom = require('boom');

async function init(){
    db = await dbo.initialize();
}

/**
 * To store booking id,admin id,driverid and assign date
 * @param {number} adminID 
 * @param {number} driverID
 * @param {number} bookingID  
 */
 const logData=(adminID,driverID,bookingID)=>{
    return new Promise((resolve,reject)=>{
        db.collection('log').insertOne({"booking_id":bookingID,"admin_id":adminID,"driver_id":driverID,"date":Date()},function(err,data){
            if(err){
                return reject(Boom.badImplementation("Implementation error").output.payload);
            }
            resolve(data);
        });
    })
    
}

/**
 * Add time when driver marked booking as complete
 * @param {number} driverID 
 * @param {number} bookingID 
 */
const addCompletionTime = (driverID,bookingID)=>{
    return new Promise((resolve,reject)=>{
        db.collection('log').updateOne({"booking_id":bookingID},{$set:{"completion_time":Date()}},{upsert:false},function(err,data){
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

