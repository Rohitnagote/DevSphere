const express = require('express');
const connectDB = require("./config/database");
const app = express();
const user = require("./models/user");

app.post('/signup', async (req, res) => {
    const newuser = new user({
       firstname: "aren",
       lastname: "yegar",
       email: "aren.yegar@example.com",
       password: "password123",
       age: 25,
       gender: "male"
     });

    await newuser.save();
    res.send("User created successfully");

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