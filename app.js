const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./MiddleWare/error");
const bodyParser=require("body-parser");
const fileUpload=require("express-fileupload")

const dotenv=require("dotenv")

//config

dotenv.config({path:"Backend/config/config.env"})


app.use(express.json());

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:true,limit: "50mb"}));
app.use(fileUpload())
//Route imports

const product = require("./Routes/productRoute");

const user = require("./Routes/userRoute");

const order = require("./Routes/orderRoute");

const payment = require("./Routes/PaymentRoute");


app.use("/api/v1", product);

app.use("/api/v1", user);

app.use("/api/v1", order);

app.use("/api/v1",payment);

//Middleware for error
app.use(errorMiddleware);

module.exports = app;
