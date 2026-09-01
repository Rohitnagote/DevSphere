//this file is for authentication routes

const express = require('express');
const authrouter = express.Router();


authrouter.post('/signup', async (req, res) => {
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