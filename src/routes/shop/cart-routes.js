import express from 'express'
const cartRouter=express.Router()
import{protect} from '../../middleware/verifyToken.js'
import{addToCart,updateCart,deleteCartItems,getCartItems} from '../../controller/shop/cartController.js'
cartRouter.post('/add',protect,addToCart)
cartRouter.put('/update',protect,updateCart)
cartRouter.delete('/clear',protect,deleteCartItems)
cartRouter.get('/',protect,getCartItems)
export default cartRouter