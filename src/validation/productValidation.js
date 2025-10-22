import Joi from "joi";


export const addProductValidation = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Product name is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Product description is required",
  }),
  sku: Joi.string().uppercase().trim().required().messages({
    "string.empty": "SKU is required",
  }),
  category: Joi.string().trim().required().messages({
    "string.empty": "Category is required",
  }),
  brand: Joi.string().trim().optional(),


  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
  discountPrice: Joi.number().min(0).optional()
    .custom((value, helpers) => {
      const { price } = helpers.state.ancestors[0];
      if (price && value > price) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Discount price cannot exceed actual price",
    }),

 
  sizes: Joi.array().items(Joi.string()).default([]),
  colors: Joi.array().items(Joi.string()).default([]),
  collections: Joi.array().items(Joi.string()).default([]),
  material: Joi.string().optional(),
  gender: Joi.string().valid("Men", "Women", "Unisex").optional(),
  image: Joi.string().uri().optional(),


  countInStock: Joi.number().integer().min(0).default(0),
  isFeatured: Joi.boolean().default(false),
  isPublished: Joi.boolean().default(false),


  tags: Joi.array().items(Joi.string()).default([]),
  metaTitle: Joi.string().optional(),
  metaDescription: Joi.string().optional(),
  metaKeyword: Joi.string().optional(),


  dimensions: Joi.object({
    length: Joi.number().min(0).optional(),
    width: Joi.number().min(0).optional(),
    height: Joi.number().min(0).optional(),
  }).optional(),
  weight: Joi.number().min(0).optional(),

  // ---------- Relations ----------
  user: Joi.string().required().messages({
    "string.empty": "User ID is required",
  }),
});
export const updateProductValidation = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string(),
  sku: Joi.string().uppercase().trim(),
  category: Joi.string().trim(),
  brand: Joi.string().trim(),

  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0)
    .custom((value, helpers) => {
      const { price } = helpers.state.ancestors[0];
      if (price && value > price) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Discount price cannot exceed actual price",
    }),

  sizes: Joi.array().items(Joi.string()),
  colors: Joi.array().items(Joi.string()),
  collections: Joi.array().items(Joi.string()),
  material: Joi.string(),
  gender: Joi.string().valid("Men", "Women", "Unisex"),
  image: Joi.string().uri(),

  countInStock: Joi.number().integer().min(0),
  isFeatured: Joi.boolean(),
  isPublished: Joi.boolean(),

  tags: Joi.array().items(Joi.string()),
  metaTitle: Joi.string(),
  metaDescription: Joi.string(),
  metaKeyword: Joi.string(),

  dimensions: Joi.object({
    length: Joi.number().min(0),
    width: Joi.number().min(0),
    height: Joi.number().min(0),
  }),
  weight: Joi.number().min(0),
});
