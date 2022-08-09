const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    userRoles: {
        type: Array,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

//create sign-up method
userSchema.statics.signup = async function (email, password, displayName) {
    
    //validate email and password
    if (!email || !password) {
        throw Error("All fields must be filled!");
    }


    //check email if exists
    const userEmail = await this.findOne({ email });

    if (userEmail) {
        throw Error("Email Already Exists");
    };cl

    //check if the email input is a proper email 
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid")
    };

    //check if password is a strong one
    if (!validator.isStrongPassword(password)) {
        throw Error("Password must have: a number, capital letter, and special character")
    };

    //hash the password using bcrypt package
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    

    //create user-roles array with a default role as user:
    const userRoles = ["user"];

    const user = await this.create({
        email,
        password: hash,
        userRoles,
        displayName
    });
    
    return user;
};


//create sign-up admin method
userSchema.statics.signupAdmin = async function (email, password, displayName) {
    
    //validate email and password
    if (!email || !password) {
        throw Error("All fields must be filled!");
    }

    //check email if exists
    const userEmail = await this.findOne({ email });

    if (userEmail) {
        throw Error("Email Already Exists");
    };
    
    //check if the email input is a proper email 
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid")
    };

    //check if password is a strong one
    if (!validator.isStrongPassword(password)) {
        throw Error("Password must have: a number, capital letter, and special character")
    };

    //hash the password using bcrypt package
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    

    //create user-roles array with a default role as user:
    const userRoles = ["user", "admin"];

    const user = await this.create({
        email,
        password: hash,
        userRoles,
        displayName
    });
    
    return user;
};

//create login method
userSchema.statics.login = async function (email, password) {
    //validate email and password
    if (!email || !password) {
        throw Error("All fields must be filled!");
    };

    //check email if exists
    const user = await this.findOne({ email });

    if (!user) {
        throw Error("Incorrect email");
    };

    //check if the hashed password equal the password that the user actually entered
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error("Incorrect password!");
    }

    return user;
};

module.exports = mongoose.model("users", userSchema);