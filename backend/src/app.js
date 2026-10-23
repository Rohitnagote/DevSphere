require("dotenv").config();

const requiredVars = ["MONGO_URI", "JWT_SECRET"];
requiredVars.forEach((name) => {
  if (!process.env[name]) {
    console.error(`Missing ${name} in the .env file`);
    process.exit(1);
  }
});

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());
const cors = require("cors");

app.use(
  cors({
    origin:process.env.CLIENT_URL, // frontend address
    credentials: true,               // allows cookies ( JWT token)
  })
);
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const projectRouter = require("./routes/project.js");


/*express will go one by one and check if the route is present in any of the routers and if it is present then it will execute that route
 and if not then it will go to the next router and check if the route is present in that router and so on. If the route is not present in any of the routers then it will return 404 error.*/
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use("/", projectRouter);


connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
   });
}).
catch((err) => {
console.error("database can not be connected" + err);
});