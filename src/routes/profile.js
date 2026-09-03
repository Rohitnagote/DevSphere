const express = require('express');
const { validateEditProfileData } = require('../utils/validation.js');

const profileRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');
const User = require('../models/user.js');


profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try{


    const user = req.user;
  
    res.send(user);
  }catch(err){
    res.send("error occured"+ err.message);
  }

});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try{
       if(!validateEditProfileData(req)){
            throw new Error("Invalid edit data");
        }
        const user = req.user;

        Object.keys(req.body).forEach((key) => {user[key] = req.body[key]});

        await user.save();
        res.send(`${user.firstname} your profile updated successfully`);
    }catch(err){
        res.send("error occured"+ err.message);
    } 
});


profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try{
        const user = req.user;
        const { oldpassword, newpassword } = req.body;
        const isvalid = await user.validatePassword(oldpassword);
        if(!isvalid){
            throw new Error("Invalid old password");
        }
        user.password = newpassword;
        await user.save();
        res.send(`${user.firstname} your password updated successfully`);
    }catch(err){
        res.send("error occured"+ err.message);
    }
});

module.exports = profileRouter;  