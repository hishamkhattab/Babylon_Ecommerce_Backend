const mongoose = require("mongoose");
const Order = require("../models/orderModel");

const createOrder = async (customer, data) => {
    const items = [];
    for (let i = 1; i <= customer.metadata.cartLength; i++) {
        let item = JSON.parse(customer.metadata[`product_${i}`])
        items.push(item);
    }

    try {
        const newOrder = await Order.create({
            orderUserID: customer.metadata.userID,
            customerID: data.customer,
            paymentStatus: data.payment_status,
            shipping: data.customer_details,
            orderTotal: data.amount_total /100,
            orderSubTotal: data.amount_subtotal /100,
            orderItems: items,
            deliveryStatus:data.status,
            paymentIntentID: data.payment_intent,
            paidCurrency: data.currency
        });

        console.log(newOrder);
    } catch (err) {
        console.log(err.message)
    }
};

const getAllUserOrders = async (req, res) => {
    const userID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(404).json({ error: "No such user" });
    };

    const orders = await Order.find({ orderUserID: userID });

    if (!orders) {
        res.status(404).json({ error: "Could not find orders" })
    }

    res.status(200).json(orders);
};


const getOrderDetails = async (req, res) => {
    const orderID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderID)) {
        return res.status(404).json({ error: "No such order" });
    };

    const order = await Order.findById(orderID);

    if (!order) {
        res.status(404).json({ error: "Could not find order" })
    }

    res.status(200).json(order);
};

//export all functions
module.exports = {
    createOrder,
    getAllUserOrders,
    getOrderDetails
}
