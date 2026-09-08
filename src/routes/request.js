const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');
const ConnectionRequest = require('../models/connectionRequest.js');

requestRouter.post('/request/send/:status/:receiverId', userAuth, async (req, res) =>{   // api for intrested or ignored connection request
    try{
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({ message: "Invalid status type: " + status });
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
        res.json({ message: "Connection request sent successfully", data });


    }catch(err){
        res.status(500).json({ message: "Error occurred: " + err.message });

    }
});
        

module.exports = requestRouter;