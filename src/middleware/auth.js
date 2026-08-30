const jwt = require('jsonwebtoken');
const user = require('../models/user');

const userAuth = async (req, res, next) => {
    // get the token from the cookies
    try{
    const { token } = req.cookies;
    if(!token){
        throw new Error("token is not valid");
    }

    // validate the token
    const decodedmessage = await jwt.verify(token, "dev@ro510");
    const { _id } = decodedmessage;


    //find the user from the database
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    req.user = user;
    next();
    }catch(err){
        res.send("error occured"+ err.message);
    }

};


module.exports = {
    userAuth,
};