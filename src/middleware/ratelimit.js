import rateLimit from "express-rate-limit";

//  Signup Rate Limiter → max 5 attempts in 30 minutes
export const signupRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, //30 minutes
  max: 5,
  message: {
    error: "Too many signup attempts",
    message: "You have exceeded the signup limit. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//  Login Rate Limiter → max 10 attempts in 15 minutes
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: "Too many login attempts",
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
