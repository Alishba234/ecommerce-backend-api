import Joi from "joi";


const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;


export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should not exceed 50 characters",
  }),
  email: Joi.string().pattern(emailPattern).required().messages({
    "string.empty": "Email is required",
    "string.pattern.base": "Please enter a valid email (like example@gmail.com)",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
  role: Joi.string().valid("customer", "admin").default("customer"),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required().messages({
    "string.empty": "Email is required",
    "string.pattern.base": "Please enter a valid email",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});
