import express from 'express'
const addressRouter=express.Router()
import{protect} from '../../middleware/verifyToken.js'
import{addAddress,updateAddress,deleteAddress,getAllAddresses,setDefaultAddress} from '../../controller/shop/addressController.js'
addressRouter.post("/add", protect, addAddress);
addressRouter.put("/update/:id", protect, updateAddress);
addressRouter.delete("/delete/:id", protect, deleteAddress);
addressRouter.get("/all", protect, getAllAddresses);
addressRouter.put("/set-default/:id", protect, setDefaultAddress);
export default addressRouter