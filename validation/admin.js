/**
 * Validations to validate admin data.
 */
const Joi = require('joi');

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