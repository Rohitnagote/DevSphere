//this file is for authentication routes

const express = require('express');
const authRouter = express.Router();
const { validatesignupdata } = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../models/user");




authRouter.post('/signup', async (req, res) => {
    try{
        validatesignupdata(req);

        const { firstname, lastname, email, password } = req.body;
        const passwordhash = await bcrypt.hash(password, 10);

        const newuser = new User({
            firstname,
            lastname,
            email,
            password: passwordhash,
        });
        const savedUser = await newuser.save();

        // log the new user in straight away
        const token = await savedUser.getJWT();
        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

        savedUser.password = undefined;
        res.status(201).send({ message: "Signup successful", user: savedUser });
    }catch(err){
        if(err.code === 11000){
            return res.status(400).send("This email is already registered");
        }
        res.status(400).send(err.message);
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
            user.password = undefined;
            res.send({message: "Login successful", user});
        }else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send(err.message);
    }
});

authRouter.post('/logout', async (req, res) => {
    try{
        res.cookie("token",null , { expires: new Date(Date.now())});
        res.send("Logout successful");
    }catch(err){
        res.status(400).send("error occured"+ err.message);
    }
});

module.exports = authRouter;