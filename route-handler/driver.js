const dbHandler        = require('../services/database-handler');
const Promise          = require('bluebird');
const CONSTANTS        = require('../properties/constants.js');
const Token            = require('../lib/token.js');
const mongoHandler     = require('../services/mongo-handler');

exports.signup=(req,res)=>{

    Promise.all([dbHandler.getUniqueEmail(req.body.email,'driver'),
        dbHandler.getUniquePhoneNo(req.body.phoneNo,'driver'),
        dbHandler.getUniqueVehicleNo(req.body.vehicleNo),
        dbHandler.getUniqueLicenseNo(req.body.licenseNo)
    ]).then(function(){
        dbHandler.addDriver(req.body.driverName,req.body.email,Token.hashPass,req.body.phoneNo,req.body.vehicleNo,req.body.licenseNo,req.body.lat,req.body.lon)
        .then(_=>res.status(CONSTANTS.responseFlags.LOGIN_SUCCESS).json({
            Data:{
                email:req.body.email,
                name:req.body.driverName,
                phoneNo:req.body.phoneNo,
                vehicleNo:req.body.vehicleNo,
                licenseNo:req.body.licenseNo,
            },
            statusCode: CONSTANTS.responseFlags.LOGIN_SUCCESS,
            Message:"signup successfull"
        }))
        .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
    })
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err))

    /**  Second method to achieve same results  */

    //Promise.coroutine(function*(){
        // yield dbHandler.getUniqueEmail(req.body.email,'driver');
        // yield dbHandler.getUniquePhoneNo(req.body.phoneNo,'driver');
        // yield dbHandler.getUniqueVehicleNo(req.body.vehicleNo);
        // yield dbHandler.getUniqueLicenseNo(req.body.licenseNo);
        // yield dbHandler.addDriver(req.body.driverName,req.body.email,Token.hashPass,req.body.phoneNo,req.body.vehicleNo,req.body.licenseNo,req.body.location);
        // res.status(CONSTANTS.responseFlags.LOGIN_SUCCESS).json({
        //     Data:{
        //         email:req.body.email,
        //         name:req.body.driverName,
        //         phoneNo:req.body.phoneNo,
        //         vehicleNo:req.body.vehicleNo,
        //         licenseNo:req.body.licenseNo,
        //     },
        //     statusCode: CONSTANTS.responseFlags.LOGIN_SUCCESS,
        //     Message:"signup successfull"
        // })
    //}).catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err))
        
}

exports.login=(req,res)=>{
    Promise.coroutine(function*(){
        const data = yield dbHandler.getDriverPassword(req.body.email);
        yield Token.matchPassword(req.body.password,data.password);
        const token = yield Token.createToken(req.body.email,data.id);
        res.status(CONSTANTS.responseFlags.LOGIN_SUCCESS).json({
            Data:{
                email:req.body.email,
                token:token,
            },
            statusCode:CONSTANTS.responseFlags.LOGIN_SUCCESS,
            Message:"Login successfull"
        });
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}

exports.deleteDriver=(req,res)=>{
    Promise.coroutine(function*(){
        yield dbHandler.checkAuthorization(req.id,'driver');
        const result = yield dbHandler.deleteDriver(req.body.email);
        res.status(CONSTANTS.responseFlags.DELETED_SUCCESSFULLY).json({
            Data:result,
            statusCode: CONSTANTS.responseFlags.DELETED_SUCCESSFULLY,
            Message:"Deletion successfull"
        })
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}

exports.updateDriver=(req,res)=>{
    Promise.coroutine(function*(){
        yield dbHandler.checkAuthorization(req.id,'driver');
        yield dbHandler.getUniquePhoneNo(req.body.phoneNo,'driver');
        yield dbHandler.updateDriver(req.body.driverName,req.id,req.body.phoneNo);
        res.status(CONSTANTS.responseFlags.UPDATED_SUCCESSFULLY).json({
            Data:{
                name:req.body.driverName,
                id:req.id,
                phoneNo:req.body.phoneNo
            },
            statusCode: CONSTANTS.responseFlags.UPDATED_SUCCESSFULLY,
            Message:"updation successfull"
        })
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}

exports.showDriverBookings=(req,res)=>{
    Promise.coroutine(function*(){
        yield dbHandler.checkAuthorization(req.id,'driver');
        const data = yield dbHandler.showDriverBookings(req.id,req.headers["offset"],req.headers["limit"],req.headers["status"]);
        res.status(CONSTANTS.responseFlags.DISPLAY_BOOKINGS).json({
            Data:data,
            statusCode:CONSTANTS.responseFlags.DISPLAY_BOOKINGS,
            Message:"Driver Bookings"
        })
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}

exports.setStatus = (req,res)=>{
    Promise.coroutine(function*(){
        yield dbHandler.checkAuthorization(req.id,'driver');
        yield dbHandler.setStatus(req.id);
        yield mongoHandler.addCompletionTime(req.id);
        res.status(CONSTANTS.responseFlags.COMPLETED_SUCCESSFULLY).json({
            Data:{
                driverID:req.id,
            },
            statusCode:CONSTANTS.responseFlags.COMPLETED_SUCCESSFULLY,
            Message:"Booking Marked as completed"
        });
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}
