import {Product} from "../../models/Product.js";
import asyncHandler from '../../middleware/asyncHandler.js'
import ApiResponse from '../../utils/apiResponse.js'
import ApiError from "../../utils/apiError.js";

export const getSingleProduct=asyncHandler(async (req,res) => {
    const{id}=req.params;
    const product=await Product.findById(id);
    if(!product) throw new ApiError(400,"Product not found")
        res.status(200).json(new ApiResponse(200,product))
    
})
//getbestsellerproduct
export const getBestSellerProducts = asyncHandler(async (req, res) => {
  
  const bestSellers = await Product.find({
    isPublished: true,
    isFeatured: true,
  })
    .sort({ rating: -1, numReviews: -1 }) // sort by rating, then reviews
    .limit(5)
    .select(
      "name price discountPrice brand category image rating numReviews collections"
    ); 

  if (!bestSellers || bestSellers.length === 0)
    throw new ApiError(404, "No bestsellers found");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        bestSellers,
        "Top 5 bestseller products fetched successfully"
      )
    );
});
export const getSimilarProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // 1️ Find the main product first
  const mainProduct = await Product.findById(productId);
  if (!mainProduct) throw new ApiError(404, "Product not found");

  // 2️ Find other products with the same category or brand
  const similarProducts = await Product.find({
    _id: { $ne: productId }, // exclude current product
    isPublished: true,
    $or: [
      { category: mainProduct.category },
      { brand: mainProduct.brand },
    ],
  })
    .limit(10) // top 10 similar items
    .select(
      "name price discountPrice brand category image rating numReviews collections"
    );

  // 3️ If no similar products found
  if (!similarProducts.length)
    throw new ApiError(404, "No similar products found");

  // 4️ Send success response
  res
    .status(200)
    .json(
      new ApiResponse(200, similarProducts, "Similar products fetched successfully")
    );
});
export const getNewArrivalsProducts = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query; // optional query param for dynamic limit

  const newArrivals = await Product.find({
    isPublished: true,
  })
    .sort({ createdAt: -1 }) // newest first
    .limit(parseInt(limit))
    .select(
      "name price discountPrice brand category image rating numReviews createdAt collections"
    );

  if (!newArrivals.length)
    throw new ApiError(404, "No new arrivals found");

  res
    .status(200)
    .json(
      new ApiResponse(200, newArrivals, "New arrival products fetched successfully")
    );
});
export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    search,
    sortBy,
    collection,
    size,
    gender,
    minPrice,
    maxPrice,
    category,
    material,
    brand,
    color,
    page = 1,  
    limit = 10, 
  } = req.query;

  // 1️⃣ Build query object dynamically
  const query = {};

  // Case-insensitive matching for arrays & strings
  if (collection && collection.toLowerCase() !== "all") {
    query.collections = { $in: [new RegExp(`^${collection}$`, "i")] };
  }
  if (category && category.toLowerCase() !== "all") {
    query.category = new RegExp(`^${category}$`, "i");
  }
  if (material) {
    query.material = { $in: material.split(",").map(m => new RegExp(`^${m}$`, "i")) };
  }
  if (brand) {
    query.brand = { $in: brand.split(",").map(b => new RegExp(`^${b}$`, "i")) };
  }
  if (size) {
    query.sizes = { $in: size.split(",").map(s => new RegExp(`^${s}$`, "i")) };
  }
  if (color) {
    query.colors = { $in: color.split(",").map(c => new RegExp(`^${c}$`, "i")) };
  }
  if (gender) {
    query.gender = new RegExp(`^${gender}$`, "i");
  }

  // 2️ Price filter
  if (minPrice || maxPrice) {
    query.price = {
      ...(minPrice && { $gte: Number(minPrice) }),
      ...(maxPrice && { $lte: Number(maxPrice) }),
    };
  }

  // 3️ Search filter (name or description)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // 4️ Sorting logic
  const sortOptions = {
    priceAsc: { price: 1 },//heigh to low
    priceDesc: { price: -1 },//low to heigh
    popularity: { rating: -1 },//heighest rating products
    newest: { createdAt: -1 },//latest products
  };
  const sort = sortOptions[sortBy] || {};

  // 5️ Pagination setup
  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const skip = (pageNumber - 1) * pageSize;

  // 6️ Fetch products
  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(pageSize);

  const total = await Product.countDocuments(query);

  // 7️ Response
  return res.status(200).json(
    new ApiResponse(200, {
      products,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
        limit: pageSize,
      },
    }, "Products fetched successfully")
  );
});

