const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const errorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleWare/catchAsyncErrors");

//create new order
exports.newOrder = catchAsyncErrors(async (req, resp, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  resp.status(201).json({
    success: true,
    order,
  });
});

//Get Single Order

exports.getSingleOrder = catchAsyncErrors(async (req, resp, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new errorHandler("Order not found with this Id", 404));
  }

  resp.status(200).json({
    success: true,
    order,
  });
});

//Get Logged in user orders(the user which is login want to see his/her orders )

exports.myOrders = catchAsyncErrors(async (req, resp, next) => {
  const orders = await Order.find({ user: req.user._id });

  resp.status(200).json({
    success: true,
    orders,
  });
});

//Get All orders --Admin

exports.getAllOrders = catchAsyncErrors(async (req, resp, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  resp.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//update order status --Admin

exports.updateOrder = catchAsyncErrors(async (req, resp, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new errorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus == "Delivered") {
    return next(new errorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBefore: false });

  resp.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id); //save product reference

  product.Stock = product.Stock - quantity;

  await product.save({ validateBeforeSave: false });
}

//delete order --Admin

exports.deleteOrder = catchAsyncErrors(async (req, resp, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new errorHandler("Order not found with this Id", 404));
  }

  await order.remove();
  resp.status(200).json({
    success: true,
  });
});
