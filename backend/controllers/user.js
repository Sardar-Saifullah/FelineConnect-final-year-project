import bcrypt from "bcrypt";
import {
  Category,
  Order,
  OrderItem,
  Payment,
  Product,
  Review,
  User,
} from "../models/index.js";
import { generateLoginToken } from "../config/generate-token.js";
import { sequelize } from "../config/db-config.js";
import dayjs from "dayjs";
import { Op } from "sequelize";

import nodemailer from "nodemailer";

// Configure Nodemailer transporter (update with your SMTP settings)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASS,
  },
});

export const getStatistics = async (req, res) => {
  try {
    // 1. Overview Data
    const totalProducts = await Product.count();
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const totalPayments = await Payment.count();
    const totalProductRatings = await Review.count();
    const totalCategories = await Category.count();

    // 2. Top 3 Most Sold Order Categories
    const topCategories = await OrderItem.findAll({
      attributes: [
        "productId",
        [sequelize.fn("COUNT", sequelize.col("orderId")), "orderCount"],
      ],
      include: [
        {
          model: Product,
          attributes: ["categoryId"],
          include: [
            {
              model: Category,
              attributes: ["name"],
            },
          ],
        },
      ],
      group: ["productId"],
      order: [[sequelize.fn("COUNT", sequelize.col("orderId")), "DESC"]],
      limit: 3,
    });

    const categoryData = topCategories.map((orderItem) => {
      const category = orderItem.Product.Category; // Access the category through the included model
      return {
        value: orderItem.get("orderCount"),
        label: category ? category.name : "Unknown Category",
      };
    });

    // 3. Payment Type Distribution
    const paymentTypes = await Payment.findAll({
      attributes: [
        "paymentMethod",
        [sequelize.fn("COUNT", sequelize.col("paymentMethod")), "paymentCount"],
      ],
      group: ["paymentMethod"],
    });

    const paymentData = paymentTypes.map((payment) => ({
      value: payment.get("paymentCount"),
      label: payment.paymentMethod,
    }));

    // 4. Line Chart Data for Last Week Sales and Earned Payments
    const lastWeekSales = [];
    const lastWeekPayments = [];

    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, "day").startOf("day");

      const salesCount = await Order.count({
        where: {
          createdAt: {
            [Op.gte]: date.toDate(),
            [Op.lt]: date.add(1, "day").toDate(),
          },
        },
      });

      const paymentCount = await Payment.sum("amount", {
        where: {
          createdAt: {
            [Op.gte]: date.toDate(),
            [Op.lt]: date.add(1, "day").toDate(),
          },
        },
      });

      lastWeekSales.push(salesCount);
      lastWeekPayments.push(paymentCount || 0);
    }

    // 5. Response Data
    return res.json({
      overview: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalPayments,
        totalProductRatings,
        totalCategories,
      },
      pieCharts: {
        categories: categoryData,
        payments: paymentData,
      },
      lineCharts: {
        sales: {
          labels: Array.from({ length: 7 }, (_, i) =>
            dayjs()
              .subtract(6 - i, "day")
              .format("YYYY-MM-DD")
          ),
          data: lastWeekSales,
        },
        payments: {
          labels: Array.from({ length: 7 }, (_, i) =>
            dayjs()
              .subtract(6 - i, "day")
              .format("YYYY-MM-DD")
          ),
          data: lastWeekPayments,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getUsers = async (req, res) => {
  try {
    // Extract pagination parameters from query
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Find and count users
    const { count, rows: users } = await User.findAndCountAll({
      include: [
        {
          model: Order,
          include: [
            {
              model: OrderItem,
              include: [
                {
                  model: Product,
                },
              ],
            },
            {
              model: Payment,
            },
          ],
        },
        {
          model: Review,
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    // Return users with pagination details
    return res.status(200).json({
      users,
      page,
      totalPages,
      totalUsers: count,
    });
  } catch (error) {
    console.error("Error fetching users with orders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users with orders",
    });
  }
};
export const createUser = async (req, res) => {
  try {
    const { username, email, password, role = "user", profileImage } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(410)
        .json({ message: "User with this email already exists." });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: password,
      role: role,
      profileImage: profileImage || null,
    });

    res.status(201).json({
      message: "User created successfully!",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email, and password are required." });
    }
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateLoginToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { username, email, profileImage, password } = req.body;
    const userId = req.params.id;
    if (!userId) {
      res.status(401).json({ message: "user id is required as param" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (profileImage) user.profileImage = profileImage;
    if (password) {
      console.log("password has been uploaded ", password);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // user.password = password;
    }
    // Save updated user
    await user.save();
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      res.status(401).json({ message: "user id is required as param" });
    }
    // console.log("This is user id ", userId);
    // Check if the user is trying to delete themselves
    // if (req.user.id === parseInt(userId, 10)) {
    //   res.status(400);
    //   throw new Error("You cannot delete your own account");
    // }

    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    await user.destroy();
    // user.isActive = false;
    // await user.save();

    res.status(200).json({
      message: `User with ID ${userId} has been successfully deleted`,
    });
  } catch (error) {
    console.error("Error user:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};


export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a random 6-digit OTP and set expiry time (e.g., 10 minutes from now)
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save OTP and expiry time to the user's record
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    // console.log(`Generated OTP: ${otp}, Expiry: ${otpExpiry}`);


    // Email content
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 10 minutes`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ message: "Error sending OTP. Please try again later." });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create Date objects for OTP expiry and current time
    const otpExpiry = new Date(user.otpExpiry);  // Date object for OTP expiry
    const currentTime = new Date();  // Current time as a Date object

    // console.log(`current time : ${currentTime.toISOString()}, Expiry: ${otpExpiry.toISOString()}`);
    // console.log(`user OTP: ${user.otp}, Expiry: ${otpExpiry.toISOString()}`);
    // console.log(`Generated OTP: ${otp}, Expiry: ${otpExpiry.toISOString()}`);

    // Check if OTP is valid and not expired, with grace period (e.g., 2 minutes)
    const gracePeriod = 2 * 60 * 1000; // 2 minutes in milliseconds
    if (user.otp !== otp.toString() || currentTime > otpExpiry + gracePeriod) {
      console.log(`hwelo`);
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear the OTP and OTP expiry from the user's record
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password. Please try again later." });
  }
};
