const express = require("express");
const Stripe = require('stripe');
const router = express.Router();

const {createOrder,getAllUserOrders, getOrderDetails} = require("../controllers/orderControllers");

const stripe = Stripe(process.env.STRIPE_KEY);

router.post('/create-checkout-session', async (req, res) => {

  const productItems = {};
  req.body.cart.forEach((el, idx) => {
    productItems[`product_${idx + 1}`] = JSON.stringify(el)
  })
  const customer = await stripe.customers.create({
    metadata: {
      userID: req.body.userID,
      cartLength: req.body.cart.length,
      ...productItems
      // cart: JSON.stringify(cart)
    }
  });

  const prodcuts = req.body.cart.map(item => {

    return {
      price_data: {
        currency: 'usd',
        tax_behavior: "inclusive",
        product_data: {
          name: item.productName,
          images: [
            item.productThumbnail
          ],
          description: `COLOR: ${item.color}, SIZE: ${item.size}`
        },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    }
  });

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ['EG', 'SA', 'QA','KW'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          tax_behavior: "inclusive",
          fixed_amount: {
            amount: 0,
            currency: 'usd',
          },
          display_name: 'Free shipping',
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          }
        }
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          tax_behavior: "inclusive",
          fixed_amount: {
            amount: 1500,
            currency: 'usd',
          },
          display_name: 'Next day air',
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 1,
            },
          }
        }
      },
    ],
    phone_number_collection: {
      enabled:true
    },
    customer_update: {
      shipping: 'auto',
    },
    automatic_tax: {
      enabled: true,
    },
    customer:customer.id,
      line_items: [
        ...prodcuts
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_url}/purchase`,
      cancel_url: `${process.env.CLIENT_url}/cart`,
    });
  
  res.status(200).json(session.url);
});

const endpointSecret = process.env.WEBHOOK_KEY;
//stripe webhook
router.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];
  // This is your Stripe CLI webhook secret for testing your endpoint locally.

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log("Webhook verified");
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    response.status(400).json(`Webhook Error: ${err.message}`);
    return;
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(session);
      
      stripe.customers.retrieve(session.customer).then(customer => {
        console.log(customer);
        createOrder(customer, session);
      }).catch(err => console.log("error:", err.message))
      // Then define and call a function to handle the event checkout.session.completed
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send().end();
});

router.get("/orders/:id", getAllUserOrders);

router.get("/order/:id", getOrderDetails);

module.exports = router;