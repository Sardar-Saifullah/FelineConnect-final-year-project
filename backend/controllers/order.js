import { sequelize } from "../config/db-config.js";
import { Order, OrderItem, Payment, Product, User } from "../models/index.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, products, apartment, address, city, phoneNo } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products array is required and cannot be empty" });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Initialize total price
    let totalOrderPrice = 0;

    // Create an array to store order items
    const orderItems = [];

    // Start a transaction to ensure data consistency
    const transaction = await sequelize.transaction();
    try {
      // Iterate over each product
      for (const productOrder of products) {
        const { productId, quantity } = productOrder;

        // Check if quantity is valid
        if (typeof quantity !== "number" || quantity <= 0) {
          throw new Error(`Invalid quantity for product ID ${productId}`);
        }

        // Find product and validate
        const product = await Product.findByPk(productId);
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        // Check if sufficient stock is available
        if (product.quantity < quantity) {
          throw new Error(
            `Insufficient stock for product ID ${productId}. Available: ${product.stock}, Requested: ${quantity}`
          );
        }

        // Deduct quantity from stock
        product.quantity -= quantity;
        await product.save({ transaction });
        // Calculate item price and total order price
        const itemPrice = product.price * quantity;
        totalOrderPrice += itemPrice;

        // Add to orderItems array
        orderItems.push({
          orderId: null, // To be updated after creating the order
          productId,
          quantity,
          price: itemPrice,
        });
      }

      // Create the order
      const newOrder = await Order.create(
        {
          userId,
          totalPrice: totalOrderPrice,
          status: "pending", // Default status
          apartment,
          address,
          city,
          phoneNo,
        },
        { transaction }
      );

      // Update orderItems with the new order ID and create entries
      for (const item of orderItems) {
        await OrderItem.create(
          {
            ...item,
            orderId: newOrder.id,
          },
          { transaction }
        );
      }

      // Commit the transaction
      await transaction.commit();

      res.status(201).json({
        message: "Order created successfully",
        order: newOrder,
        orderItems,
      });
    } catch (error) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      console.error("Error creating order:", error);
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      include: [
        {
          model: OrderItem,
          as: "OrderItems",
        },
        {
          model: Payment,
          as: "Payment",
        },
      ],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({
      orders,
      page,
      totalPages,
      totalOrders: count,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Valid values are: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    // Find the order by ID
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
