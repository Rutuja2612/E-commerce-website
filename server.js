const app=require("./app");
// const server = require('http').createServer();
// const port = process.env.PORT || 6000;
const dotenv=require('dotenv');
const cloudinary=require('cloudinary')

//Handling uncaught exception 
//e.g if we write console.log(youtube) without declaring or defining it then in terminal
//it will gives error reference error i.e uncaught for handle this we use uncaught exception


process.on('uncaughtException',(err)=>{
    console.log(`Error :${err.message}`);
    console.log(`shutting down the server due to Uncaught Exception`)
    process.exit(1);
})


const connectDatabase=require('./Config/database');
//config

dotenv.config({path:"Backend/Config/config.env"})

//connecting to database
connectDatabase();
cloudinary.config({
   cloud_name:process.env.CLOUDINARY_NAME,
   api_key:process.env.CLOUDINARY_API_KEY,
   api_secret:process.env.CLOUDINARY_API_SECRET 
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
});

//unhandled promise rejection (e.g in config.env DB_URI="mongodb://localhost:27017/Ecommerce" u wi
//u write DB_URI="mongo://localhost:27017/Ecommerce" then in terminal it will gives you error 
//invalid connection string so handle this kind of error we use this

process.on('unhandledRejection',err=>{
    console.log(`Error :${err.message}`);
    console.log(`shutting down the server due to Unhandled Promise Rejection`)

     server.close(()=>{
         process.exit(1);
     });
})