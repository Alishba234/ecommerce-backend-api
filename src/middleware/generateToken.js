import jwt from 'jsonwebtoken'
const generateToken=(res,user)=>{
   const token = jwt.sign({userId:user._id,role:user.role }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
	  httpOnly:true,
    	secure:process.env.NODE_ENV==='production',//use scure cookies in production
        sameSite:process.env.NODE_ENV==='production'?'none':'strict',//csrf protection
        maxAge:7*24*60*60*1000//cookie expiration time
	});

	return token;
}
export default generateToken