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

connectionRequestSchema.index({ senderId: 1, receiverId: 1 });

connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;
  // Check if senderId and receiverId are the same
    if (connectionRequest.senderId.equals(connectionRequest.receiverId)) {
        throw new Error("Sender and receiver cannot be the same user");
        
    }
    next();
});

const connectionRequestModel = new mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = connectionRequestModel;