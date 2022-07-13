const errorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleWare/catchAsyncErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//Register a User
exports.registerUser = catchAsyncErrors(async (req, resp) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  //console.log(user);

  //   const token=user.getJWTToken()

  //   resp.status(201).json({
  //     success: true,
  //    token,
  //   });
  sendToken(user, 201, resp);
});

//login user

exports.loginUser = catchAsyncErrors(async (req, resp, next) => {
  const { email, password } = req.body;

  //checking if user has given password and email both

  if (!email || !password) {
    return next(new errorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password"); //to find value in db

  if (!user) {
    return next(new errorHandler("Invalid email or password"));
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new errorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, resp);
});

//Logout User

exports.logOut = catchAsyncErrors(async (req, resp, next) => {
  resp.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  resp.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//Forgot password

exports.forgotPassword = catchAsyncErrors(async (req, resp, next) => {
  const user = await User.findOne({ email: req.body.email }); //find user

  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  //Get ResetPasswordToken
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is -:\n\n ${resetPasswordUrl} \n\n If you 
 have not requested to this email then, please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });

    resp.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new errorHandler(error.message, 500));
  }
});

//Get User details

exports.getUserDetails = catchAsyncErrors(async (req, resp, id) => {
  const user = await User.findById(req.user.id);

  resp.status(200).json({
    success: true,
    user,
  });
});

//Update User Profile

exports.updateProfile = catchAsyncErrors(async (req, resp, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  //update profile image using cloudinary
  if (req.body.avatar !== " ") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  resp.status(200).json({
    success: true,
  });
});

//Get all users(for admin)

exports.getAllUser = catchAsyncErrors(async (req, resp, next) => {
  const users = await User.find();

  resp.status(200).json({
    success: true,
    users,
  });
});

//Get single user(for admin)

exports.getSingleUser = catchAsyncErrors(async (req, resp, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new errorHandler(`User does not exist with Id:${req.params.id}`)
    );
  }

  resp.status(200).json({
    success: true,
    user,
  });
});

//Update User Role --Admin
exports.updateUserRole = catchAsyncErrors(async (req, resp, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
 

 const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  resp.status(200).json({
    sucesss: true,
  });
});

//Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, resp, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new errorHandler(`User does not exist with Id:${req.params.id}`)
    );
  }

  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  resp.status(200).json({
    sucesss: true,
    message: "User Deleted Succesfully",
  });
});
