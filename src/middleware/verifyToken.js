import jwt from 'jsonwebtoken'
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - no token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });

    
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.log("Error in protect middleware:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default protect;
const admin=async(req,res,next)=>{
    if(req.user&&req.user.role==='admin'){
        next()
    }else{
        res.status(403).json({message:"Not Authenticated as admin"})
    }

}
export{protect,admin}