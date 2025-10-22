
import asyncHandler from "../../middleware/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import { Review } from "../../models/Review.js";
import { Product } from "../../models/Product.js";
import{addReviewValidation,updateReviewValidation} from '../../validation/reviewValidation.js'

//  Helper: Update Product Rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      ratings: 0,
      numOfReviews: 0,
    });
    return;
  }

  const avgRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    ratings: avgRating.toFixed(1),
    numOfReviews: reviews.length,
  });
};


export const createOrUpdateReview = asyncHandler(async (req, res) => {
  //  Validate input for add/update review
  const { error } = addReviewValidation.validate(req.body, { abortEarly: false });
  if (error)
    throw new ApiError(400, error.details.map((d) => d.message).join(", "));

  const { rating, comment } = req.body;
  const { productId } = req.params;
  const userId = req.user.userId;
    if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let review = await Review.findOne({ product: productId, user: userId });

  if (review) {
    //  Validate update input separately
    const { error: updateError } = updateReviewValidation.validate(req.body, {
      abortEarly: false,
    });
    if (updateError)
      throw new ApiError(400, updateError.details.map((d) => d.message).join(", "));

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();
  } else {
    // Create new review
    review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });
  }

  await updateProductRating(productId);

  res
    .status(200)
    .json(new ApiResponse(200, review, "Review added/updated successfully"));
});


export const getReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const filter = productId ? { product: productId } : {};
  const reviews = await Review.find(filter)
    .populate("user", "name email")
    .populate("product", "name price");

  res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});


export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) throw new ApiError(404, "Review not found");

  // Allow only owner or admin to delete
  if (
    review.user.toString() !== req.user.userId.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this review");
  }

  await review.deleteOne();
  await updateProductRating(review.product);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully"));
});
