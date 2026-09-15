
const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');
const ConnectionRequest = require('../models/connectionRequest.js');
const User = require('../models/user.js');

requestRouter.post('/request/send/:status/:receiverId', userAuth, async (req, res) =>{   // api for intrested or ignored connection request
    try{
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({ message: "Invalid status type: " + status });
        }


        const receiverUser = await User.findById(receiverId);
        if(!receiverUser){
            return res.status(404).json({ message: "Receiver user not found" });
        }


        const existingRequest = await ConnectionRequest.findOne({ $or : [
            { senderId, receiverId }, 
            { senderId: receiverId, receiverId: senderId },
           ],
        });
        if(existingRequest){
            return res.status(400).json({ message: "Connection request already exists between these users" });
        }                                                            

        const connectionRequest = new ConnectionRequest({
            senderId,
            receiverId,
            status,
        });

        const data = await connectionRequest.save();
        res.json({ message: req.user.firstname +" "+ status + " "+ receiverUser.firstname, data });


    }catch(err){
        res.status(500).json({ message: "Error occurred: " + err.message });

    }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) =>{  // for accepting or rejecting connection request
    try{
        loggedInUser = req.user;
        const{ status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({ message: "Invalid status type: " + status });
        }

        const connectionRequest = await ConnectionRequest.findOne({ 
            _id: requestId,
            receiverId: loggedInUser._id,
            status: "interested",

         });

        if(!connectionRequest){
            return res.status(404).json({ message: "Connection request not found or already reviewed" });
        }
        
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: "Connection request " + status, data });
    }catch(err){
        res.status(500).json({ message: "Error occurred: " + err.message });
    }
 }
);
        

module.exports = requestRouter;
