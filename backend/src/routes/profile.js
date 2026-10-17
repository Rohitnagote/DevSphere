const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { validateEditProfileData } = require('../utils/validation.js');
const { userAuth } = require('../middleware/auth.js');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try{
    const user = req.user;
    user.password = undefined;
    res.send(user);
  }catch(err){
    res.status(400).send(err.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try{
    if(!validateEditProfileData(req)){
      return res.status(400).send("Invalid edit data");
    }

    const { skills } = req.body;
    if(skills !== undefined && (!Array.isArray(skills) || skills.length > 10)){
      return res.status(400).send("Skills must be a list of up to 10 items");
    }

    const user = req.user;
    Object.keys(req.body).forEach((key) => { user[key] = req.body[key]; });
    await user.save();

    user.password = undefined;
    res.send({ message: `${user.firstname}, your profile was updated`, user });
  }catch(err){
    res.status(400).send(err.message);
  }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try{
    const user = req.user;
    const { oldpassword, newpassword } = req.body;

    if(!oldpassword || !newpassword){
      return res.status(400).send("Old and new password are required");
    }

    const isvalid = await user.validatePassword(oldpassword);
    if(!isvalid){
      return res.status(400).send("Old password is incorrect");
    }

    if(!validator.isStrongPassword(newpassword)){
      return res.status(400).send("Password is not strong enough");
    }

    user.password = await bcrypt.hash(newpassword, 10);
    await user.save();

    res.send({ message: "Password updated" });
  }catch(err){
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;