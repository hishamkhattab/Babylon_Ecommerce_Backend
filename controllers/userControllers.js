const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//create JWT
const createToken = (id) => {
    return jwt.sign({ _id: id }, process.env.SECRET, { expiresIn: "3d" });
};

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const user = await User.login(email, password);

        //create a user-token
        const token = createToken(user._id);

        res.status(200).json({ email, token, userID: user._id, user.displayName })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//signup user
const signupUser = async (req, res) => {
    const { email, password,displayName } = req.body;

    try {
        const user = await User.signup(email, password,displayName);

        //create a token
        const token = createToken(user._id);

        res.status(200).json({ email, token, userID: user._id, displayName })
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};


