const express = require("express");
const Product = require("../models/productModel");

const {
    getProducts,
    getCertainProductCollection,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
} = require("../controllers/productControllers");

const router = express.Router();

//get all the products
router.get("/products", getProducts);

//get products in a certain collection
router.get("/products/:type", getCertainProductCollection);

//get a certain product
router.get("/product/:id", getProduct);

//create a new product
router.post("/product", createProduct);

//delete an existing product
router.delete("/product/:id", deleteProduct);

//update an existing product
router.patch("/product/:id", updateProduct);

module.exports = router;