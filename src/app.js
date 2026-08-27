const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json());

app.post('/signup', async (req, res) => {
    const newuser = new User(req.body);

    try{
    await newuser.save();
    res.send("User created successfully");
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
app.patch('/user', async(req, res) => {
    const userid = req.body.userid;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate({_id : userid}, data);
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