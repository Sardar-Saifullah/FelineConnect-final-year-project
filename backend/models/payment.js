// models/payment.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db-config.js";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      indexes: [
        {
          fields: ["orderId"],
        },
      ],
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      indexes: [
        {
          fields: ["userId"],
        },
      ],
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    paymentMethod: {
      type: DataTypes.ENUM(
        "credit_card",
        "paypal",
        "bank_transfer",
        "cash_on_delivery"
      ),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
      allowNull: false,
      defaultValue: "pending",
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "payments",
  }
);

export default Payment;
