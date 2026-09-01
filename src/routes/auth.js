//this file is for authentication routes

const express = require('express');
const authRouter = express.Router();
const { validatesignupdata } = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../models/user");




authRouter.post('/signup', async (req, res) => {
    try{
    const { firstname, lastname, email, password } = req.body;

    // validate the data
    validatesignupdata(req);


    //encrypt the password using bcrypt module

    const passwordhash = await bcrypt.hash(password, 10);
    const newuser = new User({
        firstname,
        lastname,
        email,
        password: passwordhash,
    });


    await newuser.save();
    res.send("User created successfully");
    }catch(err){
        res.send("error occured"+ err.message);
    }

});

authRouter.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({email});
        if(!user){
            throw new Error("invalid credentials");
        }
        
        const isvalid = await user.validatePassword(password);
        if(isvalid){
            // create a token using jwt module
            const token = await user.getJWT();


            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000)});
            res.send("Login successful");
        }else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.send("error occured"+ err.message);
    }
});

module.exports = authRouter;