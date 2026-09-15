const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");

//get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingRequests = await ConnectionRequest.find({
        receiverId: loggedInUser._id,
        status: "interested",
    });

    res.json({message: "Pending connection requests retrieved successfully", data: pendingRequests});

  } catch (err) {
    res.status(500).json({ message: "Error occurred: " + err.message });
  }
});
      
module.exports = userRouter;