const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://rohitnagote:rohit%40510@rocluster.rlxa9bs.mongodb.net/"
    );
};

module.exports = connectDB