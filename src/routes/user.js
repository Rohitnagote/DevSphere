const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");



//get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingRequests = await ConnectionRequest.find({
        receiverId: loggedInUser._id,
        status: "interested",
    }).populate("senderId", "firstname lastname skills"); // Populate senderId with user details

    res.json({message: "Pending connection requests retrieved successfully", data: pendingRequests});

  } catch (err) {
    res.status(500).json({ message: "Error occurred: " + err.message });
  }
});


//get all the connections of the logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try{
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or:[{ senderId: loggedInUser._id, status: "accepted"},
        { receiverId: loggedInUser._id, status: "accepted" }
      ]
      }).populate("senderId", "firstname lastname skills").populate("receiverId", "firstname lastname skills");
  
  const data = connectionRequests.map((row) => {
    if (row.senderId._id.toString() === loggedInUser._id.toString()) {
      return row.receiverId;
    }
    return row.senderId;
  });

  res.json({data});

  }catch(err){
    res.status(500).json({ message: "Error occurred: " + err.message });
  }

});


userRouter.get("/feed", userAuth, async (req, res) => {
  try{
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or:[{ senderId: loggedInUser._id},
        { receiverId: loggedInUser._id },
       ],
      }).select("senderId receiverId");
    
    const hideuser = new Set();
    connectionRequests.forEach((req) => {  
      hideuser.add(req.senderId.toString());
      hideuser.add(req.receiverId.toString());
    });


    const users = await User.find({
      $and:[
        { _id: { $nin: Array.from(hideuser) } },
        { _id: { $ne: loggedInUser._id } },  

          ],
        }).select("firstname lastname skills");

     res.send(users);
      

  }catch(err){
    res.status(500).json({ message: "Error occurred: " + err.message });
  }
});

      
module.exports = userRouter;