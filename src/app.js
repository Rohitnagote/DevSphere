const express = require('express');
const connectDB = require("./config/database");
const app = express();



const cookieParser = require('cookie-parser');



app.use(cookieParser());
app.use(express.json());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');


/*express will go one by one and check if the route is present in any of the routers and if it is present then it will execute that route
 and if not then it will go to the next router and check if the route is present in that router and so on. If the route is not present in any of the routers then it will return 404 error.*/
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);


// to update user by id
/*app.patch('/user/:userid', async(req, res) => {
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
});*/

connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
   });
}).
catch((err) => {
console.error("database can not be connected" + err);
});