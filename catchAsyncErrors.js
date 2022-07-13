module.exports=theCatchFunc=>(req,resp,next)=>{
Promise.resolve(theCatchFunc(req,resp,next)).catch(next);
}