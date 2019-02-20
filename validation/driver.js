const Joi   = require('joi');
const CONSTANTS = require('../properties/constants.js');

// Method to validate all fields.
exports.validateDriver=(req,res,next)=>{
    const schema = Joi.object().keys({
        driverName:Joi.string().required(),
        password:Joi.string().required(),
        email:Joi.string().email({ minDomainAtoms: 2 }),
        phoneNo:Joi.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/).required(),
        licenseNo:Joi.string().required(),
        vehicleNo:Joi.string().required(),
        lat:Joi.number().required(),
        lon:Joi.number().required(),
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

exports.validateUpdatedCustomer=(req,res,next)=>{
    const schema = Joi.object().keys({
        driverName:Joi.string().required(),
        email:Joi.string().email({ minDomainAtoms: 2 }),
        phoneNo:Joi.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/).required(),
        token:Joi.string().required()
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

exports.validateLogin=(req,res,next)=>{
    const schema = Joi.object().keys({
        email:Joi.string().email({minDomainAtoms:2}).required(),
        password:Joi.string().required()
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