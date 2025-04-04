import { Op } from "sequelize";
import { Product } from "../models/index.js";

export const createProduct = async (req, res) => {
  const { title, details, price, categoryId, quantity, imageSrc, discount } =
    req.body;
  if (!title || !price || !categoryId || !quantity || !imageSrc || !details) {
    return res.status(400).json({
      message:
        "title, details, price, categoryId, quantity, imageSrc (discount (optional)) are required",
    });
  }

  try {
    const product = await Product.create({
      title,
      details,
      price,
      categoryId,
      quantity,
      imageSrc,
      discount: discount ? discount : "",
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getProductByTitle = async (req, res) => {
  const { title } = req.params;
  if (!title) {
    return res.status(400).json({
      message: "title is required",
    });
  }
  try {
    // Find the product by title (case-insensitive search)
    const product = await Product.findOne({
      where: {
        title: title,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the product if found
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by title:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      products,
      page,
      totalPages,
      totalProducts: count,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const search = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const products = await Product.findAll({
      where: {
        title: {
          [Op.like]: `%${name}%`, // Case-insensitive search
        },
      },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(products);
  } catch (error) {
    console.error("Error searching for products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const filterByCategoryId = async (req, res) => {
  const { categoryId } = req.body;

  if (!categoryId) {
    return res.status(400).json({ message: "Category ID is required" });
  }

  try {
    const products = await Product.findAll({
      where: {
        categoryId: categoryId,
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Error filtering products by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const filterByDate = async (req, res) => {
  const { sortByDate } = req.body; // Boolean value to determine sort order

  // Check for invalid sortByDate value
  if (sortByDate !== "true" && sortByDate !== "false") {
    return res.status(400).json({ message: "Invalid value for sortByDate" });
  }

  const isDescending = sortByDate === "true";

  // Extract pagination parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: products } = await Product.findAndCountAll({
      order: [["createdAt", isDescending ? "DESC" : "ASC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      products,
      page,
      totalPages,
      totalProducts: count,
    });
  } catch (error) {
    console.error("Error filtering products by date:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  try {
    const [updated] = await Product.update(data, { where: { id } });
    if (updated) {
      const updatedProduct = await Product.findByPk(id);
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Product.destroy({ where: { id } });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
