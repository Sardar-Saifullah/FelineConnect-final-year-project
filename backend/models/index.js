import User from "./user.js";
import Product from "./product.js";
import Review from "./review.js";
import Order from "./order.js";
import Category from "./category.js";
import Payment from "./payment.js";
import OrderItem from "./order-item.js"; // Corrected import path

// Define associations

// User - Order
User.hasMany(Order, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Order.belongsTo(User, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// User - Review
User.hasMany(Review, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Review.belongsTo(User, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

// Product - Review
Product.hasMany(Review, {
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Review.belongsTo(Product, {
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// Category - Product
Category.hasMany(Product, {
  foreignKey: "categoryId",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});
Product.belongsTo(Category, {
  foreignKey: "categoryId",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

// Order - Payment
Order.hasOne(Payment, {
  foreignKey: "orderId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Payment.belongsTo(Order, {
  foreignKey: "orderId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// User - Payment
User.hasMany(Payment, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Payment.belongsTo(User, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// Order - OrderItem (New association)
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// Product - OrderItem (New association)
Product.hasMany(OrderItem, {
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

export { User, Product, Review, Order, Category, Payment, OrderItem };
