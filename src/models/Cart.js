
import mongoose from 'mongoose';


const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String },
    price: { type: Number, required: true }, // ✅ use Number, not String
    size: { type: String },
    color: { type: String },
    quantity: { type: Number, default: 1, min: 1 }, // ✅ minimum 1
  },
  { _id: false } 
);


const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [cartItemSchema], 
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);


export const Cart = mongoose.model("Cart", cartSchema);
