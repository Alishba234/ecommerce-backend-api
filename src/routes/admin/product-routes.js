import express from 'express'
const productRouter=express.Router()
import {protect,admin}  from '../../middleware/verifyToken.js'
import{imageUploadHanlder,addProduct,updateProduct,deleteProduct,getAllProducts} from '../../controller/admin/productController.js'
import { upload } from '../../config/cloudinary.js'
productRouter.use(protect,admin)
productRouter.post('/upload-image',upload.single('image'),imageUploadHanlder)
productRouter.post('/add',addProduct)
productRouter.put('/:id',updateProduct)
productRouter.delete('/:id',deleteProduct)
productRouter.get('/',getAllProducts)
export default productRouter