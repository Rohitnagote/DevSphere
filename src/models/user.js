const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender:{
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error ("Gender must be male female or others");
            }

        }    

    },
    about: {
        type: String,
        default: "No information provided",
    },
    skills: {
        type: [String],
    }
},

{
    timestamps: true,
});

const User = mongoose.model("User", userschema);

module.exports = User; 