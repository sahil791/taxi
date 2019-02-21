/**
 * Validations to validate bookings data.
 */
const Joi   = require('joi');
const CONSTANTS = require('../properties/constants.js');

// Method to validate all fields.
exports.validateBooking=(req,res,next)=>{
    const schema = Joi.object().keys({
        fromLat:Joi.number().min(-90).max(90).required(),
        fromLon:Joi.number().min(-180).max(180).required(),
        toLat:Joi.number().min(-90).max(90).required(),
        toLon:Joi.number().min(-180).max(180).required(),
        cost:Joi.number().required(),
        token:Joi.string().required(),
    });
    Joi.validate(req.body, schema, function (err, value) { 
        if (err) {
            res.json({
              message: 'Insufficient information was supplied. Please check and try again.',
              status: 400,
              data: err.details[0].message,
            });
          } else {
            next();
          }
    }); 
}

exports.validateShowBooking=(req,res,next)=>{
  const schema = Joi.object().keys({
      token:Joi.string().required(),
      offset:Joi.number().required(),
      limit:Joi.number().required(),
      status:Joi.number().required()
  });
  Joi.validate(req.headers, schema, function (err, value) { 
      if (err) {
          res.json({
            message: 'Insufficient information was supplied. Please check and try again.',
            status: 400,
            data: err.details[0].message,
          });
        } else {
          next();
        }
  }); 
}