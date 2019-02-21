/**
 *  All admin related functions are defined in this file.
 */

const dbHandler        = require('../services/database-handler');
const Promise          = require('bluebird');
const CONSTANTS        = require('../properties/constants.js');
const Token            = require('../lib/token.js');
const mongoHandler     = require('../services/mongo-handler')

exports.login=(req,res)=>{
    Promise.coroutine(function*(){
        const result = yield dbHandler.adminLogin(req.body.email,req.body.password);
        const token  = yield Token.createToken(result.email,result.id);
        res.status(CONSTANTS.responseFlags.LOGIN_SUCCESS).json({
            Data:{
                email:result.email,
                token:token
            },
            statusCode: CONSTANTS.responseFlags.LOGIN_SUCCESS,
            Message:"Login successfull"
        })
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}

exports.assignDriver=(req,res)=>{

    Promise.coroutine(function*(){

        yield dbHandler.checkAuthorization(req.id,'admin');
        yield dbHandler.checkDriverAvailability(req.body.driverID);
        yield dbHandler.assignDriver(req.body.driverID,req.body.bookingID,req.id);
        yield mongoHandler.logData(req.id,req.body.driverID,req.body.bookingID);
        res.status(CONSTANTS.responseFlags.DRIVER_ASSIGNED).json({
            Data:{
                bookingID:req.body.bookingID,
                driverID:req.body.driverID
            },
            statusCode: CONSTANTS.responseFlags.DRIVER_ASSIGNED,
            Message:"Driver assigned to booking"
        })
        
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}