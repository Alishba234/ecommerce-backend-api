import Joi from "joi";

// Add Address Validation (All fields required)
export const addAddressValidation = Joi.object({
  fullName: Joi.string().trim().required().messages({
    "string.empty": "Full name is required",
  }),
  address: Joi.string().trim().required().messages({
    "string.empty": "Address is required",
  }),
  city: Joi.string().trim().required().messages({
    "string.empty": "City is required",
  }),
  postalCode: Joi.string().trim().required().messages({
    "string.empty": "Postal code is required",
  }),
  country: Joi.string().trim().required().messages({
    "string.empty": "Country is required",
  }),
  phone: Joi.string().trim().required().messages({
    "string.empty": "Phone number is required",
  }),
  isDefault: Joi.boolean().optional(),
});


//  Update Address Validation (All fields optional)
export const updateAddressValidation = Joi.object({
  fullName: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  postalCode: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
  phone: Joi.string().trim().optional(),
  isDefault: Joi.boolean().optional(),
});
