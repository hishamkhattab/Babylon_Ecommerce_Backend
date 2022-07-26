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
router.get("/", getProducts);

//get products in a certain collection
router.get("/", getCertainProductCollection);

//get a certain product
router.get("/:id", getProduct);

//create a new product
router.post("/", createProduct);

//delete an existing product
router.delete("/:id", deleteProduct);

//update an existing product
router.patch("/:id", updateProduct);

module.exports = router;