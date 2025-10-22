
import { User } from "../../models/User.js";
import generateToken from "../../middleware/generateToken.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from '../../utils/apiResponse.js'
import asyncHandler from "../../middleware/asyncHandler.js";
import asynHandler from '../../middleware/asyncHandler.js'

export const register=asyncHandler(async (req,res) => {
    const { email, password, name, role } = req.body;

  if (!email || !password || !name) throw new ApiError(400, "All fields are required");

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, "Email already exists");
  const user=new User({
    name,
    email,
    password,
    role:role||'user'
  });
  await user.save();
  if(user){
    generateToken(res,user)
    res.status(200).json(new ApiResponse(200,user,"User register successfully"))
   

  }
    
})
export const login = asynHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Explicitly select password since it's excluded by default
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }

  generateToken(res, user);

  res.status(200).json(
    new ApiResponse(200, {
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  );
});
export const logout = asyncHandler(async (req, res) => {
  // Clear the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only https in production
    sameSite: "strict",
  });

  res.status(200).json(
    new ApiResponse(200, null, "Logged out successfully")
  );
});