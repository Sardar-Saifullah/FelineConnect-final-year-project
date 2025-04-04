// models/user.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db-config.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "provider"),
      allowNull: false,
      defaultValue: "user",
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    otp: {
      type: DataTypes.STRING,  // Store OTP as string (6-digit OTP)
      allowNull: true,
    },
    otpExpiry: {
      type: DataTypes.DATE,  // Store OTP expiry as a date
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

// Hash the password before creating a new user
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

export default User;