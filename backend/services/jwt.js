const jwt = require("jwt-simple");
const moment = require("moment");

const secretKey = "SECRET_KET_social_NEtworK:0510";

const createToken = (user) => {

    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        generation: moment().unix(),
        expiration: moment().add(30, "days").unix()
    }

    return jwt.encode(payload, secretKey);
}

module.exports = {
    secretKey,
    createToken
}