import express from 'express'
const orderRouter=express.Router();
import validateRequest from '../../middleware/validateRequest.js';
import {createOrderValidation} from '../../validation/orderValidation.js'
import {protect} from '../../middleware/verifyToken.js'
import{createOrder,getUserOrders,getOrderById,} from '../../controller/shop/orderController.js'
orderRouter.post("/", protect,validateRequest(createOrderValidation), createOrder);
orderRouter.get("/", protect, getUserOrders);
orderRouter.get("/:id", protect, getOrderById);

export default orderRouter