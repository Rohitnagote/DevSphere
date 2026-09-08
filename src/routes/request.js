const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');
const ConnectionRequest = require('../models/connectionRequest.js');

requestRouter.post('/request/send/intrested/:receiverId', userAuth, async (req, res) => {
    try{
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;
        const status = req.params.receiverId;


    }catch(err){
        res.send("error occured"+ err.message);
    }
});
        

module.exports = requestRouter;