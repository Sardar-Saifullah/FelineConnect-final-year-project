import { stripe } from "../config/stripe-config.js";
import { Order, Payment, User } from "../models/index.js";
export const createPayment = async (req, res) => {
  try {
    const {
      orderId,
      userId,
      amount,
      paymentMethod,
      paymentStatus,
      transactionId,
    } = req.body;

    // Validate input
    if (!orderId || !userId || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Check if the order and user exist
    const order = await Order.findByPk(orderId);
    const user = await User.findByPk(userId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the payment
    const newPayment = await Payment.create({
      orderId,
      userId,
      amount,
      paymentMethod,
      paymentStatus: paymentStatus || "pending", // Default to "pending" if not provided
      transactionId: transactionId || null,
    });

    res
      .status(201)
      .json({ message: "Payment created successfully", payment: newPayment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const checkout = async (req, res) => {
  const { products, originUrl } = req.body;
  if (
    !products ||
    !Array.isArray(products) ||
    products.length === 0 ||
    !originUrl
  ) {
    return res.status(400).json({ message: "Products are required" });
  }

  try {
    // Prepare line items directly using the prices from the products
    const line_items = products.map((product) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name, // Name of the product
          },
          unit_amount: product.price, // Price from the product (in cents)
        },
        quantity: product.quantity, // Quantity from the product
      };
    });

    // Create a checkout session with multiple products
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items, // Use directly provided product prices
      success_url: `${originUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${originUrl}/cancel`,
    });

    res.status(201).json({
      message: "Payment checkout page created successfully",
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
