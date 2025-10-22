import express from 'express'
const productsRouter=express.Router()
import{getSingleProduct,getBestSellerProducts,getSimilarProducts,getNewArrivalsProducts,getAllProducts}from '../../controller/shop/productController.js'
productsRouter.get('/best-seller',getBestSellerProducts)
productsRouter.get('/similar/:productId',getSimilarProducts)
productsRouter.get('/new-arrivals',getNewArrivalsProducts)
productsRouter.get('/:id',getSingleProduct)
productsRouter.get('/',getAllProducts)
export default productsRouter