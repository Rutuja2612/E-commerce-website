const errorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt=require('jsonwebtoken');

const User = require("../models/userModels");
exports.isAuthenticatedUser=catchAsyncErrors(async (req,resp,next)=>{

    const {token}=req.cookies;
    //console.log(token)

    if(!token){
        return next(new errorHandler("Please Login to access this resource",401))
    }

       const decodedData=jwt.verify(token,process.env.JWT_SECRET)

     req.user=await User.findById(decodedData.id);
       
       //console.log(decodedData);

       next();

})


exports.authorizeRoles=(...roles)=>{
  return (req,resp,next)=>{
    if(!roles.includes(req.user.role)){
     return next(new errorHandler(`Role:${req.user.role} is not allowed to access this resoure`,403)
    )}

    next();
  }
}



//if(!roles.includes(req.user.role))=>if(!roles.includes(user)) not user means admin