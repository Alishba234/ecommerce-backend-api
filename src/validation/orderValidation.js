import Joi from "joi";

export const createOrderValidation = Joi.object({
  orderItems: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required().messages({
          "any.required": "Product ID is required",
          "string.empty": "Product ID cannot be empty",
        }),
        name: Joi.string().required().messages({
          "any.required": "Product name is required",
        }),
        image: Joi.string().optional(),
        price: Joi.number().min(0).required().messages({
          "number.base": "Price must be a number",
          "any.required": "Price is required",
        }),
        quantity: Joi.number().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
        size: Joi.string().optional(),
        color: Joi.string().optional(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Order items must be an array",
      "array.min": "At least one order item is required",
      "any.required": "Order items are required",
    }),

  shippingAddress: Joi.object({
    fullName: Joi.string().required().messages({
      "any.required": "Full name is required",
    }),
    address: Joi.string().required().messages({
      "any.required": "Address is required",
    }),
    city: Joi.string().required().messages({
      "any.required": "City is required",
    }),
    postalCode: Joi.string().required().messages({
      "any.required": "Postal code is required",
    }),
    country: Joi.string().required().messages({
      "any.required": "Country is required",
    }),
    phone: Joi.string().required().messages({
      "any.required": "Phone number is required",
    }),
  }).required(),

  paymentMethod: Joi.string()
    .valid("COD", "Stripe", "PayPal")
    .required()
    .messages({
      "any.only": "Payment method must be COD, Stripe, or PayPal",
      "any.required": "Payment method is required",
    }),

  itemsPrice: Joi.number().min(0).required().messages({
    "number.base": "Items price must be a number",
    "any.required": "Items price is required",
  }),
  shippingPrice: Joi.number().min(0).required(),
  taxPrice: Joi.number().min(0).required(),
  totalPrice: Joi.number().min(0).required(),
});

