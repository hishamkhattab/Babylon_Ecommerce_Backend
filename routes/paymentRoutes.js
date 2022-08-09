const express = require("express");
const Stripe = require('stripe');
const router = express.Router();

const stripe = Stripe(process.env.STRIPE_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const prodcuts = req.body.map(item => {
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
    automatic_tax: {
      enabled: true,
    },
      line_items: [
        ...prodcuts
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_url}/purchase`,
      cancel_url: `${process.env.CLIENT_url}`,
    });
  
  res.status(200).json(session.url);
});
  
module.exports = router;