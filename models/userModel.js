const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userEmail: {
        type: String,
        required: true,
    },
    userRoles: {
        type: Array,
        required: true,
    },
    userThumbnail: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("users", userSchema);