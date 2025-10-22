
import {Order} from "../../models/Order.js";
import asyncHandler from '../../middleware/asyncHandler.js'
import ApiResponse from '../../utils/apiResponse.js' 
import ApiError from "../../utils/apiError.js";


export const getAllOrdersOfAllUsers=asyncHandler(async (req,res) => {
  const orders=await Order.find({})
  if(!orders) throw new ApiError(404,"Orders not found")
    res.status(200).json(new ApiResponse(200,orders,"Orders fetched"))
  
})
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status;

  if (status === "Delivered") {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  await order.save();
  res.status(200).json(new ApiResponse(200, order, "Order status updated"));
});


export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  await order.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Order deleted"));
});