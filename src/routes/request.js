const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');

requestRouter.post('/request', userAuth, async (req, res) => {
    try{

    }catch(err){
        res.send("error occured"+ err.message);
    }
});
        

module.exports = requestRouter;