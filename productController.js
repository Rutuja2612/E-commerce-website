const Product = require("../models/productModel");
const errorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleWare/catchAsyncErrors");
//const User = require("../models/userModels");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//create Products --admin

exports.createProduct = catchAsyncErrors(async (req, resp, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  //console.log(product)

  resp.status(201).json({
    success: true,
    product,
  });
});

//Get All products
exports.getAllProducts = catchAsyncErrors(async (req, resp, next) => {
  const resultPerPage = 3;

  const productsCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFeatures.query; //it will gives all product
  resp.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
  });
});

//Get All products(Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, resp, next) => {
  const products = await Product.find();

  resp.status(200).json({
    success: true,
    products,
  });
});

//get Product Details

exports.getProductDetails = catchAsyncErrors(async (req, resp, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  resp.status(200).json({
    success: true,
    product,
  });
});

//update Product--admin

exports.updateProduct = catchAsyncErrors(async (req, resp, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  //images start here
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    //Deleting Images from Cloudinary

    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  resp.status(200).json({
    success: true,
    product,
  });
});

//delete product

exports.deleteProduct = catchAsyncErrors(async (req, resp, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  //Deleting Images from Cloudinary

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove(); //if product found

  resp.status(200).json({
    success: true,
    message: "Product Deleted Succesfully",
  });
});

//201 means created

//create New Review  or Update Review

exports.createProductReview = catchAsyncErrors(async (req, resp, next) => {
  const { rating, comment, productId } = req.body; //destructuring

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length; //for new or first review
  }

  let avg = 0;
  product.ratings = product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  resp.status(200).json({
    success: true,
  });
});

//Get All Reviews of a product

exports.getProductReviews = catchAsyncErrors(async (req, resp, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  resp.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete Review

exports.deleteReview = catchAsyncErrors(async (req, resp, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });
  const ratings = avg / reviews.length;

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  resp.status(200).json({
    success: true,
  });
});

//suppose 4,5,5,2 these are ratings given by user
//so total is 16 and length is 4 so, 16/4=4 overall rating is 4

//here we use filter method and only keeps those reviews that we want to keep
//and delete that we don't wann to keep
