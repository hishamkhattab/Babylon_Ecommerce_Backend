const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderUserID: {
        type: String,
        required: true,
    },
    orderTotal: {
        type: Number,
        required: true,
    },
    orderItems: {
        type: Array,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("orders", orderSchema);