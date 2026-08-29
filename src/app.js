const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validatesignupdata } = require("./utils/validation");
const bcrypt = require('bcrypt');

app.use(express.json());

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({email});
        if(!user){
            throw new Error("invalid credentials");
        }
        
        const ismatch = await bcrypt.compare(password, user.password);
        if(ismatch){
            res.send("Login successful");
        }else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.send("error occured"+ err.message);
    }
});

// to get user by email
app.get('/user', async (req, res) => {
    const useremail = req.body.email;
    try{
        const user = await User.find({email: useremail});
        if(user.length==0){
            res.send("User not found"+err.message);
        }else{
            res.send(user);
        }
    }catch(err){
        res.send("error occured"+ err.message);
    }

});

// to get all users
app.get('/feed', async(req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.send("error occured"+ err.message);
    }
});

// to delete user by id
app.delete('/user', async(req, res) => {
    const userid = req.body.userid;
    try{
        const user = await User.findByIdAndDelete(userid);
        if(!user){
            res.send("User not found");
        }else{
            res.send("User deleted successfully");
        }
    }catch(err){
        res.send("error occured"+ err.message);
    }
});


// to update user by id
app.patch('/user/:userid', async(req, res) => {
    const userid = req.params?.userid;
    const data = req.body;
    try{
        const update_allowed = ["age", "gender", "about", "skills"];
        const isvalidupdate = Object.keys(data).every((key) => update_allowed.includes(key));  // check if all keys in req.body are in the allowed to update 
        if(!isvalidupdate){
            throw new Error("Invalid update fields");
        }

        if(data?.skills.length > 10){
            throw new Error("Skills should not be more than 10");
        }

        const user = await User.findByIdAndUpdate({_id : userid}, data,{runValidators: true});
        res.send("User updated successfully");
    }catch(err){
        res.send("error occured"+ err.message);
    }   
});

connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
   });
}).
catch((err) => {
console.error("database can not be connected" + err);
});