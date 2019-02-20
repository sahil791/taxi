const dbHandler        = require('../services/database-handler');
const Promise          = require('bluebird');
const CONSTANTS        = require('../properties/constants.js');
const Token            = require('../lib/token.js');

exports.signup=(req,res)=>{
    Promise.coroutine(function*(){
        yield dbHandler.getUniqueEmail(req.body.email,'customer');
        yield dbHandler.getUniquePhoneNo(req.body.phoneNo,'customer');
        yield dbHandler.addCustomer(req.body.customerName,req.body.email,Token.hashPass,req.body.phoneNo,req.body.lat,req.body.lon);
        res.status(CONSTANTS.responseFlags.SIGN_UP_SUCCESS).json({
            Data:{
                email:req.body.email,
                name:req.body.customerName,
                phoneNo:req.body.phoneNo,
            },
            statusCode: CONSTANTS.responseFlags.SIGN_UP_SUCCESS,
            Message:"signup successfull"
        })
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}

exports.login=(req,res)=>{
    Promise.coroutine(function*(){
        const data = yield dbHandler.getCustomerPassword(req.body.email);
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
/**
 * 
 */
exports.showAllCustomers=(req,res)=>{
    Promise.coroutine(function*(){
        yield dbHandler.checkAuthorization(req.id,'admin');
        const result = yield dbHandler.getAllCustomers(req.headers["offset"],req.headers["limit"]);
        res.status(CONSTANTS.responseFlags.DISPLAY_CUSTOMERS).json({
            Data:result,
            statusCode: CONSTANTS.responseFlags.DISPLAY_CUSTOMERS,
            Message:"All customers displayed successfully"
        })
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}

exports.deleteCustomer=(req,res)=>{
    Promise.coroutine(function*(){

        yield dbHandler.checkAuthorization(req.id,'customer');
        const result = yield dbHandler.deleteCustomer(req.id);
        res.status(CONSTANTS.responseFlags.DELETED_SUCCESSFULLY).json({
            Data:{
                id:req.id
            },
            statusCode: CONSTANTS.responseFlags.DELETED_SUCCESSFULLY,
            Message:"Deletion successfull"
        })
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}


exports.updateCustomer=(req,res)=>{
    Promise.coroutine(function*(){
        yield dbHandler.checkAuthorization(req.id,'customer');
        yield dbHandler.getUniquePhoneNo(req.body.phoneNo,'customer');
        yield dbHandler.updateCustomer(req.body.customerName,req.body.email,req.body.phoneNo);
        res.status(CONSTANTS.responseFlags.UPDATED_SUCCESSFULLY).json({
            Data:{
                name:req.body.customerName,
                email:req.body.email,
                phoneNo:req.body.phoneNo
            },
            statusCode: CONSTANTS.responseFlags.UPDATED_SUCCESSFULLY,
            Message:"updation successfull"
        })
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}

exports.showCustomerBookings=(req,res)=>{
    Promise.coroutine(function*(){
        yield dbHandler.checkAuthorization(req.id,'customer');
        const data = yield dbHandler.showCustomerBookings(req.id,req.headers["offset"] || req.query.offset,req.headers["limit"] || req.query.limit,req.headers["status"] || req.query.status);
        res.status(CONSTANTS.responseFlags.DISPLAY_BOOKINGS).json({
            Data:data,
            statusCode:CONSTANTS.responseFlags.DISPLAY_BOOKINGS,
            Message:"Customer Bookings"
        });
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}