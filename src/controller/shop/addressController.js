import asyncHandler from "../../middleware/asyncHandler.js";
import { Address } from "../../models/Address.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import { addAddressValidation, updateAddressValidation } from "../../validation/addressValidation.js";



export const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  
  const { error } = addAddressValidation.validate(req.body, { abortEarly: false });
  if (error) throw new ApiError(400, error.details.map((d) => d.message).join(", "));

  //  Create address
  const address = await Address.create({
    ...req.body,
    user: userId,
    isDefault: req.body.isDefault || false,
  });

  res
    .status(201)
    .json(new ApiResponse(201, address, "Address added successfully"));
});


//  Update Address
export const updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  //  Validate body
  const { error } = updateAddressValidation.validate(req.body, { abortEarly: false });
  if (error) throw new ApiError(400, error.details.map((d) => d.message).join(", "));

  // Find and update
  const address = await Address.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!address) throw new ApiError(404, "Address not found");

  res
    .status(200)
    .json(new ApiResponse(200, address, "Address updated successfully"));
});


//  Delete Address
export const deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const address = await Address.findOneAndDelete({ _id: id, user: userId });
  if (!address) throw new ApiError(404, "Address not found");

  res.status(200).json(new ApiResponse(200, {}, "Address deleted successfully"));
});


//  Get All Addresses for a User
export const getAllAddresses = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, addresses, "Addresses fetched successfully"));
});


//  Set Default Address
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const address = await Address.findOne({ _id: id, user: userId });
  if (!address) throw new ApiError(404, "Address not found");

  // unset previous default
  await Address.updateMany(
    { user: userId, _id: { $ne: id } },
    { $set: { isDefault: false } }
  );

  address.isDefault = true;
  await address.save();

  res
    .status(200)
    .json(new ApiResponse(200, address, "Default address set successfully"));
});
