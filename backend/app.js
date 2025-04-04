import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./config/db-config.js";
import cors from "cors";
import path from "path";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);
const logStream = createWriteStream(path.join(__dirname, "access.log"));
app.use(morgan("combined", { stream: logStream }));
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import reviewRoutes from "./routes/review.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
app.get("/", (req, res) => {
  res.send("Hello, world!. This is cats store app's backend");
});
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use((req, res) => {
  res.status(404).json({
    error: "404 - Not Found",
    message: "The route you are trying to access does not exist.",
  });
});
const PORT = process.env.PORT || 8000;
sequelize
  .sync()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
