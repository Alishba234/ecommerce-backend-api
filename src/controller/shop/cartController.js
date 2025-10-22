import {Cart} from "../../models/Cart.js";
import asyncHandler from '../../middleware/asyncHandler.js'
import ApiResponse from '../../utils/apiResponse.js'
import ApiError from "../../utils/apiError.js";
import { addToCartValidation, updateCartValidation } from "../../validation/cartValidation.js";
import { Product } from "../../models/Product.js";
//helper to fetch userId
const getCart = async (userId) => {
  return await Cart.findOne({ user: userId });
};

//  Helper function to calculate total cart price
const calculateTotalPrice = (products) => {
  return products.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

//1:  Add to Cart
export const addToCart = asyncHandler(async (req, res) => {
 
  const { error, value } = addToCartValidation.validate(req.body, {
    abortEarly: false,
  });
  if (error)
    throw new ApiError(400, error.details.map((d) => d.message).join(", "));

  const userId = req.user.userId;
  const { productId, quantity, color, size,name } = value;

  //  2. Check if product exists
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  //  3. Get or create user’s cart
  let cart = await getCart(userId);
  if (!cart) {
    cart = await Cart.create({ user: userId, products: [], totalPrice: 0 });
  }

  //  4. Check if product (same color & size) already exists
  const existingProduct = cart.products.find(
    (item) =>
      item.productId.toString() === productId.toString() &&
      item.size === size &&
      item.color === color
  );

  //  5. If product exists → increase quantity
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    //  Otherwise → add new item
    cart.products.push({
      productId,
      name: name || product.name,
      price: product.discountPrice || product.price,
      size,
      color,
      quantity,
    });
  }

  //  6. Update total cart price using helper
  cart.totalPrice = calculateTotalPrice(cart.products);

  //  7. Save and respond
  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, cart, "Product added to cart successfully"));
});
export const updateCart = asyncHandler(async (req, res) => {
 
  const { error, value } = updateCartValidation.validate(req.body, {
    abortEarly: false,
  });
  if (error)
    throw new ApiError(400, error.details.map((d) => d.message).join(", "));

  const userId = req.user.userId;
  const { productId, quantity, color, size } = value;

  //  2. Get user’s cart
  const cart = await getCart(userId)
  if (!cart) throw new ApiError(404, "Cart not found");

  //  3. Find the product in the cart (match by productId + color + size)
  const existingProduct = cart.products.find(
    (item) =>
      item.productId.toString() === productId.toString() &&
      item.size === size &&
      item.color === color
  );

  if (!existingProduct)
    throw new ApiError(404, "Product not found in your cart");

  //  4. Update the quantity
  existingProduct.quantity = quantity;

  //  5. Recalculate total cart price
  cart.totalPrice = calculateTotalPrice(cart.products);

  //  6. Save and respond
  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart updated successfully"));
});
export const deleteCartItems = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  //  Find user's cart
  const cart = await getCart(userId);
  if (!cart) throw new ApiError(404, "Cart not found");

  //  If cart already empty
  if (cart.products.length === 0)
    throw new ApiError(400, "Cart is already empty");

  //  Clear all products
  cart.products = [];
  cart.totalPrice = 0;

  //  Save changes
  await cart.save();

  //  Respond
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "All cart items deleted successfully"));
});
export const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  //  1. Find the user’s cart
  const cart = await getCart(userId);
  if (!cart) throw new ApiError(404, "Cart not found");

  //  2. If empty
  if (cart.products.length === 0)
    throw new ApiError(404, "Your cart is empty");

  //  3. Respond with cart details
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        cartId: cart._id,
        user: cart.user,
        totalPrice: cart.totalPrice,
        products: cart.products.map((item) => ({
          productId: item.productId?._id,
          name: item.productId?.name || item.name,
          price: item.productId?.discountPrice || item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
      },
      "Cart fetched successfully"
    )
  );
});