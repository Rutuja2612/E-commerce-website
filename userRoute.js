const express=require('express');
const { getProductReviews, deleteReview } = require('../controllers/productController');
const { registerUser, loginUser, logOut, forgotPassword, getUserDetails, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController');

const {isAuthenticatedUser,authorizeRoles}=require("../middleWare/auth");
const { route } = require('./productRoute');
const router=express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

//router.route("/password/forgot").post(forgotPassword);
router.route("/logout").get(logOut);

router.route("/me").get(isAuthenticatedUser,getUserDetails);

router.route("/me/update").put(isAuthenticatedUser,updateProfile);

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUser)


router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)

router.route("/admin/user/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole);

router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser);

router.route("/reviews").get(getProductReviews);

router.route("/reviews").delete(isAuthenticatedUser,deleteReview)



module.exports=router;


//isAuthenticatedUser -: you should be login