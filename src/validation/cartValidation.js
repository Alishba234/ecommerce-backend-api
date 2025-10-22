import Joi from "joi";

//  Validation for Add to Cart
export const addToCartValidation = Joi.object({
  productId: Joi.string().required().messages({
    "any.required": "Product ID is required",
    "string.empty": "Product ID cannot be empty",
  }),

  name: Joi.string().optional(),

//   price: Joi.number().required().messages({
//     "any.required": "Price is required",
//     "number.base": "Price must be a number",
//   }),

  size: Joi.string().optional(),

  color: Joi.string().optional(),

  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
  }),
});

//  Validation for Update Cart Item
export const updateCartValidation = Joi.object({
  productId: Joi.string().optional().messages({
    "string.empty": "Product ID cannot be empty",
  }),

  price: Joi.number().optional().messages({
    "number.base": "Price must be a number",
  }),

  size: Joi.string().optional(),

  color: Joi.string().optional(),

  quantity: Joi.number().integer().min(1).optional().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
  }),
});
