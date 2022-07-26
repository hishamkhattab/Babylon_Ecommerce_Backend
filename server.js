require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

//router
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const paymentRouter = require("./routes/paymentRoutes");

const app = express();
//middleware
// app.use(express.json());
app.use((req, res, next) => {
    if (req.originalUrl === '/api/payment/webhook') {
      next(); // Do nothing with the body because I need it in a raw state.
    } else {
      express.json()(req, res, next);  // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
    }
  });
app.use((req, res, next) => {
    console.log("Path: ", req.path);
    console.log("Method: ", req.method);
    next();
});

//routes
app.use("/api/ecommerce", productRouter);
app.use("/api/user", userRouter);
app.use("/api/payment", paymentRouter);

//connecting to mongoDB
mongoose.connect(process.env.MONGO_DB)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log(`Connected To DB & Listening on port: ${process.env.PORT}`);
        })
    })
    .catch(err => console.log(err.message));
