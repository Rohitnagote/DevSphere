const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
              values: ["ignored", "interested", "accepted", "rejected"],
              message: `{VALUE} is not a valid status type`,
            },

        },
},
{
    timestamps: true,
}

);

const connectionRequestModel = new mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = connectionRequestModel;