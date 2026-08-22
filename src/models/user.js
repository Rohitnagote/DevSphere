const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender:{
        type: String,
    },
});

const User = mongoose.model("User", userschema);

module.exports = User;