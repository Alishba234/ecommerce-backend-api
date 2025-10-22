import express from 'express'
import fs from 'fs'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDb from './config/db.js'
import userRouter from './routes/auth/userroutes.js'
import productRouter from './routes/admin/product-routes.js'
import productsRouter from './routes/shop/product-routes.js'
import cartRouter from './routes/shop/cart-routes.js'
import orderRouter from './routes/shop/order-routes.js'
import { stripeWebhook } from './controller/shop/orderController.js'
import ordersRouter from './routes/admin/order-routes.js'
import addressRouter from './routes/shop/address-routes.js'
import reviewRouter from './routes/shop/review-routes.js'
import swaggerUi from "swagger-ui-express";
import globalErrorHandler from './utils/globalErrorHandler.js'
const swaggerDocs = JSON.parse(fs.readFileSync("./src/swagger/swagger-output.json", "utf-8"));

dotenv.config()
const app = express()
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs))
const PORT = process.env.PORT || 5000

//  Webhook route
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
)

//  Normal middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//  Routes
app.get('/', (req, res) => res.send('API is working'))
app.use('/api/user', userRouter)
app.use('/api/admin', productRouter)
app.use('/api/admin', ordersRouter)
app.use('/api/product', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/address',addressRouter)
app.use('/api/review',reviewRouter)

//  DB connection + error handler
connectDb()
app.use(globalErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})
