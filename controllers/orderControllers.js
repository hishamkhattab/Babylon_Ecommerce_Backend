const mongoose = require("mongoose");

const Order = require("../models/orderModel");

const createOrder = async (customer, data) => {
    const items = JSON.parse(customer.metadata.cart);

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

//export all functions
module.exports = {
    createOrder
}
