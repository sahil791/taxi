/**
 *  All Booking related functions are defined in this file.
 */

const dbHandler        = require('../services/database-handler');
const Promise          = require('bluebird');
const CONSTANTS        = require('../properties/constants.js');
const Token            = require('../lib/token.js');

exports.createBooking=(req,res)=>{
    Promise.coroutine(function*(){
        yield dbHandler.checkAuthorization(req.id,'customer');
        yield dbHandler.createBooking(req.id,req.body.fromLat,req.body.fromLon,req.body.toLat,req.body.toLon,req.body.cost)
        res.status(CONSTANTS.responseFlags.BOOKING_CREATED).json({
            Data:{
                email:req.body.email,
                pickupLocation:{
                    fromLat:req.body.fromLat,
                    fromLon:req.body.fromLon
                },
                destination_location:{
                    toLat:req.body.toLat,
                    toLon:req.body.toLon
                },
                estimatedCost:req.body.estimatedCost
            },
            statusCode: CONSTANTS.responseFlags.BOOKING_CREATED,
            Message:"updation successfull"
        })
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err))
}

exports.showBookings = (req,res)=>{
    Promise.coroutine(function*(){
        yield dbHandler.checkAuthorization(req.id,'admin');
        const data = yield dbHandler.showBookings(req.headers["offset"],req.headers["limit"],req.headers["status"]);
        res.status(CONSTANTS.responseFlags.DISPLAY_BOOKINGS).json({
            Data:data,
            statusCode: CONSTANTS.responseFlags.DISPLAY_BOOKINGS,
            Message:"Bookings"
        })
    })()
    .catch(err=>res.status(CONSTANTS.responseFlags.INVALID_CREDENTIALS).send(err));
}