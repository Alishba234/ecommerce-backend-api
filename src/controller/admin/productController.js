import {Product} from "../../models/Product.js";
import asyncHandler from '../../middleware/asyncHandler.js'
import ApiResponse from '../../utils/apiResponse.js'
import {imageUploadUtil} from '../../config/cloudinary.js' 
import ApiError from "../../utils/apiError.js";
import { addProductValidation, updateProductValidation } from "../../validation/productValidation.js";

export const imageUploadHanlder=asyncHandler(async (req,res) => {
    if (!req.file) throw new ApiError(400, "No file uploaded");
      const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);
    res.status(200).json(
    new ApiResponse(200, result, "Image uploaded successfully")
  );
    
})


export const addProduct=asyncHandler(async (req,res) => {
    const { error } = addProductValidation.validate(req.body, { abortEarly: false });
  if (error) throw new ApiError(400, error.details.map((d) => d.message).join(", "));

  const product = await Product.create(req.body);

   res.status(200).json(
    new ApiResponse(200, product, "product added successfully")
  );
    
})


export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error } = updateProductValidation.validate(req.body, { abortEarly: false });
  if (error) throw new ApiError(400, error.details.map((d) => d.message).join(", "));

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  if (req.body.sku && req.body.sku !== product.sku) {
    const existing = await Product.findOne({ sku: req.body.sku });
    if (existing) throw new ApiError(400, "SKU already exists");
  }

  Object.assign(product, req.body);
  await product.save();

  res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});



export const deleteProduct=asyncHandler(async (req,res) => {
    const{id}=req.params;
    const deletedproduct=await Product.findByIdAndDelete(id)
    if(!deletedproduct) throw new ApiError(404,"product nor found")
        res.status(200).json(new ApiResponse(200, deletedproduct,"product removed"))
    
})
export const getAllProducts=asyncHandler(async (req,res) => {
  const listOfProducts=await Product.find({})
  if(!listOfProducts) throw new ApiError(404,"product not found")
  res.status(200).json(new ApiResponse(200,listOfProducts))
  
})
