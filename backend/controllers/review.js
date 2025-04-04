import { Review, Product, User } from "../models/index.js";
export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review by ID, and include the associated user and product
    const review = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          attributes: ["id", "email", "name"], // Include user details
        },
        {
          model: Product,
          attributes: ["id", "title"], // Include product details
        },
      ],
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving review", error });
  }
};
export const getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, size = 10 } = req.query; // Default to page 1 and 10 items per page

    // Convert `page` and `size` to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(size, 10);

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    // Fetch the paginated reviews for the specified product, including user details
    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { productId },
      include: [
        {
          model: User,
          attributes: ["id", "email", "username", "profileImage"],
        },
        {
          model: Product,
          attributes: ["id", "title"],
        },
      ],
      offset,
      limit,
      order: [["createdAt", "DESC"]], // Order reviews by creation date
    });

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this product" });
    }

    // Calculate total pages
    const totalPages = Math.ceil(count / pageSize);
    // Return paginated reviews and pagination info
    return res.status(200).json({
      reviews,
      pagination: {
        totalReviews: count,
        totalPages,
        currentPage: pageNumber,
        pageSize,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving reviews", error });
  }
};

const calculateAverageRating = async (productId) => {
  const reviews = await Review.findAll({
    where: { productId },
    attributes: ["rating"],
  });

  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

  return totalReviews > 0 ? totalRating / totalReviews : 0;
};
export const createReview = async (req, res) => {
  try {
    const { rating, comment, userId, productId } = req.body;

    // Validate input
    if (!rating || !comment || !userId || !productId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the review
    const newReview = await Review.create({
      rating,
      comment,
      userId,
      productId,
    });

    // Calculate the new average rating for the product
    const averageRating = await calculateAverageRating(productId);

    // Update the product with the new average rating
    await product.update({ averageRating });

    return res.status(201).json({
      message: "Review created successfully",
      review: newReview,
      averageRating,
    });
  } catch (error) {
    console.error("Error creating review:", error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Error creating review", error: error.message });
  }
};
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // Find the review by ID
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the review with new rating and comment
    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Recalculate the average rating for the product
    const averageRating = await calculateAverageRating(review.productId);

    // Update the product's average rating
    const product = await Product.findByPk(review.productId);
    await product.update({ averageRating });

    return res.status(200).json({
      message: "Review updated successfully",
      review,
      averageRating,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating review", error });
  }
};
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review by ID
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const productId = review.productId;

    // Delete the review
    await review.destroy();

    // Recalculate the average rating for the product
    const averageRating = await calculateAverageRating(productId);

    // Update the product's average rating
    const product = await Product.findByPk(productId);
    await product.update({ averageRating });

    return res.status(200).json({
      message: "Review deleted successfully",
      averageRating,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting review", error });
  }
};
