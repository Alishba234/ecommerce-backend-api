import express from 'express'
const reviewRouter=express.Router()
import{protect,admin} from '../../middleware/verifyToken.js'
import{createOrUpdateReview,getReviews,deleteReview} from '../../controller/shop/reviewController.js';
reviewRouter.post('/:productId',protect,createOrUpdateReview)
reviewRouter.get('/',getReviews)
reviewRouter.delete('/:reviewId',protect, admin,deleteReview)

export default reviewRouter