
const catchAsyncErrors = require("../middleWare/catchAsyncErrors");

const stripe=require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment=catchAsyncErrors(async(req,resp,next)=>{

     const myPayment=await stripe.paymentIntents.create({
         amount:req.body.amount,
         currency:"inr",
         metadata:{
             company:"Ecommerce",
         }
     })

     resp.status(200).json({success:true,client_secret:myPayment.client_secret})
})



exports.sendStripeApiKey=catchAsyncErrors(async(req,resp,next)=>{
    resp.status(200).json({stripeApiKey:process.env.STRIPE_API_KEY})
})