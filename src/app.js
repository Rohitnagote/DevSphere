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

connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
   });
}).
catch((err) => {
console.error("database can not be connected" + err);
});