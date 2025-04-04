// models/product.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db-config.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imageSrc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: "products",
  }
);

export default Product;
