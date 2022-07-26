const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    productCategory: {
        type: [String],
        required: true,
    },
    productThumbnail: {
        type: String,
        required: true,
    },
    productImages: {
        type: [String],
        required: true,
    },
    size: {
        type: [String],
    },
    colors: {
        type: [String],
        required: true,
    },
    productAdminID: {
        type: String,
        required: true,
    },
    productCollection: {
        type: String,
        required: true,
        index:true,
    }
}, { timestamps: true });

module.exports = mongoose.model("products", productSchema);