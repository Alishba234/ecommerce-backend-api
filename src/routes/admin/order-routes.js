import express from 'express'
const ordersRouter=express.Router()
import{protect,admin} from '../../middleware/verifyToken.js'
import{updateOrderStatus,deleteOrder,getAllOrdersOfAllUsers} from '../../controller/admin/orderController.js'
ordersRouter.use(protect,admin)
ordersRouter.put('/status/:id',updateOrderStatus)
ordersRouter.get('/orders',getAllOrdersOfAllUsers)
ordersRouter.delete('/:id',deleteOrder)

export default ordersRouter