import mongoose from 'mongoose'
 const connectDb=async()=>{
    try {
       await mongoose.connect(`${process.env.MONGO_URL}/shopshere`)
       console.log("Mongodb connected");
       
    } catch (error) {
        console.log("Unable to connect database");
        
    }
}
export default connectDb