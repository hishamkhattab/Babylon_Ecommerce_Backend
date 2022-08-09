const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderUserID: {
        type: String,
        required: true,
    },
    customerID: {
        type: String,
        required: true,
    },
    paymentIntentID: {
        type: String,
        required: true,
    },
    paidCurrency: {
        type: String,
        required: true,
    },
    deliveryStatus: {
        type: String,
        default: "pending",
    },
    paymentStatus: {
        type: String,
        required: true,
    },
    shipping: {
        type: Object,
        required: true,
    },
    orderTotal: {
        type: Number,
        required: true,
    },
    orderSubTotal: {
        type: Number,
        required: true,
    },
    orderItems: [
        {
            _id: { type: String },
            productName: { type: String },
            price: { type: String },
            productThumbnail: { type: String },
            qty: { type: String },
            size: { type: String },
            color: { type: String },
            productAdminID: { type: String },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("orders", orderSchema);