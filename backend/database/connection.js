const mongoose = require('mongoose');

const connection = async() => {
    try{

        const url = "mongodb://localhost:27017/social-network";
        mongoose.set('strictQuery', true);
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //mongodb use by default ipv4 and cannot connect to localhost throught ipv4
            family: 4
        });
        console.log("Connection to database established succesfully");

    }catch(err){
        console.log(err);
        throw new Error("Connection to database could not be established");
    }
}

module.exports = { connection }