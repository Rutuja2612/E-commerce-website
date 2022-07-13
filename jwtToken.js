//creating token and saving in cookie

const sendToken=(user,StatusCode,resp)=>{
    const token=user.getJWTToken();

    //options for cookie

  const options={
      expires:new Date(
        Date.now() + process.env.COOKIE_EXPIRE *24 *60*60*1000
      ),
      httpOnly:true,
      
  };

   // console.log(options);
    //console.log(StatusCode);
    //console.log(token);
  resp.status(StatusCode).cookie('token',token,options).json({
      success:true,
      user,
      token
  })

}


module.exports=sendToken