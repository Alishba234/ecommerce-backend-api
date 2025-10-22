import express from 'express'
const userRouter=express.Router()
import{ signupRateLimiter,loginRateLimiter }from '../../middleware/ratelimit.js'
import {registerSchema,loginSchema }from '../../validation/authValidation.js'
import{register,login,logout} from '../../controller/auth/userController.js'
import validateRequest from '../../middleware/validateRequest.js'
userRouter.post('/register',signupRateLimiter,validateRequest(registerSchema), register)
userRouter.post('/login',loginRateLimiter,validateRequest(loginSchema),login)
userRouter.post('/logout',logout)
export default userRouter