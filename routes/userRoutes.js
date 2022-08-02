const express = require("express");
const {loginUser,signupUser,getAllUsers,signupAdminUser } = require("../controllers/userControllers"); 
const router = express.Router();

//get all users
router.get("/users", getAllUsers);

//signup route
router.post("/signup", signupUser);

//signup admin route
router.post("/signup/admin", signupAdminUser);

//login route
router.post("/login", loginUser);

module.exports = router;