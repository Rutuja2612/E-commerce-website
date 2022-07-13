const express=require("express");
const { processPayment, sendStripeApiKey } = require("../controllers/paymentControllers");

const router=express.Router();

const { isAuthenticatedUser}=require("../middleWare/auth");

router.route("/payment/process").post(isAuthenticatedUser,processPayment);

router.route("/stripeApikey").get(isAuthenticatedUser,sendStripeApiKey)

module.exports=router;