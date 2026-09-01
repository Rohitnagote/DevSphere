const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email" + value);
            }       
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough");
            }
        }
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


userschema.methods.getJWT = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id}, "dev@ro510", {expiresIn: "7d"});
    return token;
};

userschema.methods.validatePassword = async function(inputpassword) {
    const user = this;
    const isvalid = await bcrypt.compare(inputpassword, user.password);
    return isvalid;
};


const User = mongoose.model("User", userschema);

module.exports = User; 