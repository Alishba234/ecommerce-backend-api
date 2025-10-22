import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
  
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      trim: true,
    },

  
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },

  
    sizes: {
      type: [String],
      required: true,
      default: [],
    },
    colors: {
      type: [String],
      required: true,
      default: [],
    },
    collections: {
      type: [String],
      required: true,
      default: [],
    },
    material: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
    },
    image: {
      type: String,
    },


    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

  
    tags: {
      type: [String],
      default: [],
    },
    metaTitle: String,
    metaDescription: String,
    metaKeyword: String,

 
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
    weight: {
      type: Number,
      min: 0,
    },

 
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
productSchema.pre("save", function (next) {
  if (this.discountPrice && this.discountPrice > this.price) {
    return next(new Error("Discount price cannot exceed the actual price"));
  }
  next();
});


productSchema.index({ name: "text", description: "text", tags: "text" }); // Full-text search


export const Product = mongoose.model("Product", productSchema);
