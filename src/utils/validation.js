const validator = require('validator');

const validatesignupdata = (req) => {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname ){
        throw new Error("Firstname and lastname are required");
    }
    else if (!email || !validator.isEmail(email)) {
        throw new Error("Invalid email");
    }
    else if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
};

module.exports = {
    validatesignupdata,
}