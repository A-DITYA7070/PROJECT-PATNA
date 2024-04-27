import { Seller } from "../../models/accounts/seller.model.js";
import CryptoJS from "crypto-js";
import ErrorHandler from "../../utils/errorHandler.js";
import { catchAsyncError } from "../../middlewares/errors/catchAsyncErrors.js";
import { sendToken } from "../../utils/sendToken.js";
import generateRandomToken from "../../utils/generateRandomToken.js";
import { Order } from "../../models/orders/order.model.js";


/**
 * function to register admin - disable it after creating admin
 */
const register = catchAsyncError(async(req,res,next) => {
    const {name,email,password,phoneNumber} = req.body;

    if(!name || !email || !password || !phoneNumber) return next(new ErrorHandler("Please Enter all fields..",400));
    
    let user = await Seller.findOne({email});
    if(user){
        return next(new ErrorHandler("user already exists ",409));
    }
    
    // upload file on cloudinary..
    
    // const file=req.file;
    // const fileUri=getDataUri(file);
    // const mycloud=await cloudinary.v2.uploader.upload(fileUri.content);
    const token = generateRandomToken(30);
    user = await Seller.create({
        name,
        email,
        password,
        phoneNumber,
        avatar:{
            // public_id:mycloud.public_id,
            // url:mycloud.secure_url,
            public_id:"demo_id",
            url:"demo_url"
        },
        sellerCookie:token
    });   
    const sellerCookieOptions = {
        httpOnly:true,
        secure:true,
        path:"/api/v1"
    }
    res.cookie("seller",token,sellerCookieOptions);
    sendToken(res,user,"Registered succesfully ",201);
});


/**
 *  controller function to login 
 */
const login = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password) return next(new ErrorHandler("Please Enter all fields..",400));
    
    const user = await Seller.findOne({email}).select("+password +sessionToken +sellerCookie");
    if(!user){
        return next(new ErrorHandler("User not found ",404));
    }
    
    const isMAtch = await user.comparepassword(password);

    if(!isMAtch){
        return next(new ErrorHandler("Incorrect Email or password",401));
    }
    const token = generateRandomToken(30);
    user.sellerCookie = token;
    await user.save();
    
    const sellerCookieOptions = {
        httpOnly:true,
        secure:true,
        path:"/api/v1"
    }
    res.cookie("seller",token,sellerCookieOptions);
    sendToken(res,user,`Welcome back !! ${user.name}`,200);
   
 });

/**
 * Controller function to logout
 */
const logout = catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:false,
        secure:true,
        sameSite:"lax",
    })
    .json({
        success:true,
        message:"logged out successfully"
    })
 });

 /**
  * Controller function to get profile of admin
  */
 const myProfile = catchAsyncError(async(req,res,next) => {
    const user = await Seller.findById(req.user.id);
    res.status(200)
    .json({
        success:true,
        user
    })
 });

/**
 * Controller function to update order status.
 */
const processOrder = catchAsyncError(async(req,res,next)=>{
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const order = await Order.findById(id);
    if(!order){
        return next(new ErrorHandler("Not found",404));
    }
    order.status = "PROCESSING";
    await order.save();
    res.status(200)
    .json({
        success:true,
        message:"Order processed"
    });
});
/**
 * Controller function to send order to delivery partner
 */
const sendOrdertoDeliveryPartner = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request",400));
    }
    const order = await Order.findById(id);
    if(!order){
        return next(new ErrorHandler("Not found",404));
    }
    order.status = "SHIPPED";
    await order.save();
    res.status(200)
    .json({
        success:true,
        message:"Order shipped"
    });
});


 export {
    register,
    login,
    logout,
    myProfile,
    processOrder,
    sendOrdertoDeliveryPartner
 }