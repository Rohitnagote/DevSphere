const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try{
        const { token } = req.cookies;
        if(!token){
            return res.status(401).send("Please login");
        }

        const decodedmessage = await jwt.verify(token, "dev@ro510");
        const { _id } = decodedmessage;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(401).send("Please login");
    }
};

module.exports = {
    userAuth,
};