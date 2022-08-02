const mongoose = require("mongoose");

const Product = require("../models/productModel");

//get All Products
const getProducts = async (req, res) => {

	const page = req.query.page || 0;
	const productPerPage = 8;
	
	console.log(page)
	
    const product = await Product.find({}).sort({ updatedAt: -1 }).skip(page * productPerPage).limit(productPerPage);
    res.status(200).json(product);
    
};

//get certain category's products
const getCertainProductCollection = async (req, res) => {
    const type = req.params.type;
	const page = req.query.page || 0;
	const productPerPage = 8;
	
    const product = await Product.find({productCategory : type}).sort({ updatedAt: -1 }).skip(page * productPerPage).limit(productPerPage);
    res.status(200).json(product);
};

//get a single product
const getProduct = async (req, res) => {
    const productID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
        return res.status(404).json({ error: "No such product" });
    };

    const product = await Product.findById(productID);

    if (!product) {
        return res.status(404).json({ error: "No such product" });
    };


    res.status(200).json(product);
};

//create a new product
const createProduct = async (req, res) => {
    const {
        productName,
        description,
        price,
        stock,
        productCategory,
        productThumbnail,
        productImages,
        size,
        colors,
        productAdminID,
    } = req.body;

    let emptyFields = [];

    if (!productName) {emptyFields.push("productName")};
    if (!description) {emptyFields.push("description")};
    if (!price) {emptyFields.push("price")};
    if (!stock) {emptyFields.push("stock")};
    if (!productCategory) {emptyFields.push("productCategory")};
    if (!productThumbnail) {emptyFields.push("productThumbnail")};
    if (!productImages) {emptyFields.push("productImages")};
    if (!colors) {emptyFields.push("colors")};


    if (emptyFields.length > 0) {
        return res.status(400).json({ error: "Please fill in all the fields", emptyFields });
    };

    try {
        const product = await Product.create({...req.body});

        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
};

//delete an existing product
const deleteProduct = async (req, res) => {
    const productID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
        return res.status(404).json({ error: "No such product" });
    };

    const product = await Product.findOneAndDelete({ _id: productID });

    if (!product) {
        return res.status(404).json({ error: "No such product" });
    };

    res.status(200).json(product);
};

//update an existing product
const updateProduct = async (req, res) => {
    const productID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
        return res.status(404).json({ error: "No such product" });
    };

    const product = await Product.findOneAndUpdate({ _id: productID }, { ...req.body });

    if (!product) {
        return res.status(404).json({ error: "No such product" });
    };

    res.status(200).json(product);
};

//export all functions
module.exports = {
    getProducts,
    getCertainProductCollection,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
}
