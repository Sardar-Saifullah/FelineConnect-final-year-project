// models/category.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db-config.js";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      indexes: [
        {
          unique: true,
          fields: ["name"],
        },
      ],
    },
  },
  {
    timestamps: true,
    tableName: "categories",
  }
);

export default Category;
