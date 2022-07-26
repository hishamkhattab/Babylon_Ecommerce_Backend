require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

//router
const productRouter = require("./routes/productRoutes");

const app = express();
//middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log("Path: ", req.path);
    console.log("Method: ", req.method);
    next();
});

//routes
app.use("/api/ecommerce", productRouter);

//connecting to mongoDB
mongoose.connect(process.env.MONGO_DB)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log(`Connected To DB & Listening on port: ${process.env.PORT}`);
        })
    })
    .catch(err => console.log(err.message));
