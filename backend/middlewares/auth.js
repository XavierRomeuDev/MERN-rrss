const jwt = require("jwt-simple");
const moment = require("moment");
const libjwt = require("../services/jwt");

const secret = libjwt.secretKey;

exports.auth = (req, res, next) => {

    if(!req.headers.authorization){
        return res.status(403).send({
            status: "Error",
            message: "Request without auth header"
        });
    }

    let token = req.headers.authorization.replace(/['"]+/g,'');
    
    try{
        let payload = jwt.decode(token, secret);    

        if(payload.expiration <= moment().unix()){
            return res.status(401).send({
                status: "Error",
                message: "Expired token"
            });
        }

        req.user = payload;

    }catch(err){
        return res.status(404).send({
            status: "Error",
            message: "Invalid token"
        });
    }

    next();

}