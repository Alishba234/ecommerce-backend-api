import Joi from "joi";

//  Add Review Validation Schema
export const addReviewValidation = Joi.object({
 
  rating: Joi.number().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot exceed 5",
    "any.required": "Rating is required",
  }),

  comment: Joi.string().trim().min(3).max(500).required().messages({
    "string.base": "Comment must be a string",
    "string.empty": "Comment cannot be empty",
    "string.min": "Comment must be at least 3 characters long",
    "string.max": "Comment cannot exceed 500 characters",
    "any.required": "Comment is required",
  }),
});


//  Update Review Validation Schema
export const updateReviewValidation = Joi.object({
  rating: Joi.number().min(1).max(5).optional().messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot exceed 5",
  }),

  comment: Joi.string().trim().min(3).max(500).optional().messages({
    "string.base": "Comment must be a string",
    "string.min": "Comment must be at least 3 characters long",
    "string.max": "Comment cannot exceed 500 characters",
  }),
}).or("rating", "comment") 
  .messages({
    "object.missing": "Please provide at least one field to update (rating or comment)",
  });
