/**
 * File creates method to create a token and access a token 
 * Hash password and compare a plaintext with hashed password.
 */

const bcrypt                               = require('bcrypt') ;
const privateKey                           = 'secret';
const jwt                                  = require('jsonwebtoken');
const Boom                                 = require('boom');

exports.createToken=(email,id)=>{
    return new Promise((resolve,reject)=>{

        let tokenData = {
            email:email,
            id:id
        }
        let token = jwt.sign({tokenData:tokenData},privateKey,{expiresIn: 60*60*60});
        resolve(token);
    })
}

exports.hashPassword=async function(req,res,next){
    const salt =  await bcrypt.genSalt(10);
    const hash =  await bcrypt.hash(req.body.password,salt)
    exports.hashPass=hash;
    next();
}

exports.matchPassword=(plainText,hashPassword)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.compare(plainText, hashPassword, function(err, result) {
            if(result){
                resolve("Login Successfull");
            }
            else{
                reject(Boom.unauthorized('Invalid password').output.payload);
            }
        });
    })  
}

exports.accessToken =(req,res,next)=>{
    try{
        const decoded = jwt.verify(req.body.token || req.headers["token"],privateKey);
        req.id = decoded.tokenData.id;
        next();
    }
    catch(error){
        res.send(Boom.unauthorized('Session expired').output.payload);
    }
}