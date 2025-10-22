import {Cart} from "../../models/Cart.js";
import {Order} from "../../models/Order.js";
import asyncHandler from '../../middleware/asyncHandler.js'
import ApiResponse from '../../utils/apiResponse.js'
import ApiError from "../../utils/apiError.js";
import Stripe from "stripe";
import dotenv from 'dotenv'
dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//  Helper — calculate total
const calculateTotal = (cart) => {
  return cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
};

//  Create Order (COD or Stripe)
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: userId }).populate("products.productId");
  if (!cart || cart.products.length === 0)
    throw new ApiError(400, "Cart is empty");

  const itemsPrice = calculateTotal(cart);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const orderItems = cart.products.map((item) => ({
    product: item.productId._id,
    name: item.name,
    image: item.productId.image,
    price: item.price,
    quantity: item.quantity,
    color: item.color,
    size: item.size,
  }));

  //  Create order object
  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    status: paymentMethod === "Stripe" ? "Pending" : "Processing",
  });

  //  Clear cart after order creation
  cart.products = [];
  cart.totalPrice = 0;
  await cart.save();

  //  If payment method = Stripe, create session
  if (paymentMethod === "Stripe") {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order-success?orderId=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/order-failed`,
      metadata: { orderId: order._id.toString(), userId },
    });

    return res.status(200).json(
      new ApiResponse(200, { url: session.url }, "Stripe session created")
    );
  }

  //  If COD → mark as Processing
  res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully (COD)"));
});


//  Stripe Webhook (handles payment success)
export const stripeWebhook = asyncHandler(async (req, res) => {
  let event;
  try {
     const rawBody = req.body; // must be raw
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(" Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  //  Handle event type
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = "Processing";
      order.paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
        amount: session.amount_total / 100,
        currency: session.currency,
      };
      await order.save();
      console.log(" Order payment updated successfully");
    }
  }

  res.status(200).json({ received: true });
});


// Get all user orders
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, orders, "Orders fetched"));
});


//  Get single order
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product");

  if (!order) throw new ApiError(404, "Order not found");
  res.status(200).json(new ApiResponse(200, order, "Order fetched"));
});


