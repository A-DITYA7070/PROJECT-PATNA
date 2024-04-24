import cloudinary from "cloudinary";
import getDataUri from "../../utils/dataUri.js";
import { sendToken } from "../../utils/sendToken.js";
import { catchAsyncError } from "../../middlewares/errors/catchAsyncErrors.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { Manager } from "../../models/accounts/manager.model.js";
import CryptoJS from "crypto-js";
import { Product } from "../../models/products/product.model.js";
import mongoose, { Error } from "mongoose";
import { Seller } from "../../models/accounts/seller.model.js";


function generateRandomToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }
    const hashedToken = CryptoJS.SHA512(token).toString();
    return hashedToken;
}


const managerCookieOptions = {
    httpOnly:true,
    secure:true,
    path:"/api/v1"
}

const register = catchAsyncError(async(req,res,next)=>{
    const {name,email,password,phoneNumber} = req.body;

    if(!name || !email || !password || !phoneNumber) return next(new ErrorHandler("Please Enter all fields..",400));
    
    let manager = await Manager.findOne({email});
    if(manager){
        return next(new ErrorHandler("Manager already exists ",409));
    }

    // upload file on cloudinary..
    
    // const file=req.file;
    // const fileUri=getDataUri(file);
    // const mycloud=await cloudinary.v2.uploader.upload(fileUri.content);
    const token = generateRandomToken(30);
    manager = await Manager.create({
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
        managerCookie:token
    });
    res.cookie("manager",token,managerCookieOptions);
    sendToken(res,manager,"Registered succesfully ",201);
   
 });

 const login = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password) return next(new ErrorHandler("Please Enter all fields..",400));
    
    const manager = await Manager.findOne({email}).select("+password");
    if(!manager){
        return next(new ErrorHandler("Manager not found ",404));
    }
    
    const isMAtch = await manager.comparepassword(password);

    if(!isMAtch){
        return next(new ErrorHandler("Incorrect Email or password",401));
    }
    const token = generateRandomToken(30);
    manager.managerCookie = token;
    await manager.save();
    res.cookie("manager",token,managerCookieOptions);
    sendToken(res,manager,`Welcome back !! ${manager.name}`,200);
   
 });

 /**
  * manager controller function to logout
  */
 const logout = catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:false,
        secure:true,
        sameSite:"lax",
    }).json({
        success:true,
        message:"logged out successfully"
    })
 });

 /**
  * Manager controller function to get profile of manager
  */
 const myProfile = catchAsyncError(async(req,res,next) => {
    const manager = await Manager.findById(req.user.id);
    res.status(200)
    .json({
        success:true,
        manager
    })
 });


 /**
  * manager controller function to get all unverified product.
  */
 const getUnverifiedProducts = catchAsyncError(async(req,res,next)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const skip = (page - 1) * limit;

    const pipeline = [
        {
            $match:{
                isApproved:false
            }

        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $lookup: {
                from: "sellers",
                localField: "seller",
                foreignField: "_id",
                as: "seller"
            }
        },
        {
            $unwind: "$seller"
        },
        {
            $lookup: {
                from: "subcategories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory"
            }
        },
        {
            $unwind: "$subCategory"
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ];
    const products = await Product.aggregate(pipeline);
    res.status(200).json({
        success:true,
        products
    })
 });


 /**
  * manager controller function to get single verified product.
  */
 const getUnverifiedProduct = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    
    const pipeline = [
        {
            $match:{
                _id: new mongoose.Types.ObjectId(id),
                isApproved:false
            }

        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $lookup: {
                from: "sellers",
                localField: "seller",
                foreignField: "_id",
                as: "seller"
            }
        },
        {
            $unwind: "$seller"
        },
        {
            $lookup: {
                from: "subcategories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory"
            }
        },
        {
            $unwind: "$subCategory"
        },
        {
            $project:{
                "seller.sellerCookie":0,
                "seller.sessionToken":0,
            }
        }
    ];
    
    const product = await Product.aggregate(pipeline);

    
    if(!product){
        return next(new ErrorHandler("Not found",404));
    }

    res.status(200)
    .json({
        success:true,
        product
    });
 });

 /**
  * Controller function to approve product 
  */
 const approveProduct = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const product = await Product.findById(id);
    if(!product){
        return next(new ErrorHandler("Not Found",404));
    }
    product.isApproved=true;
    
    let images = product.images;
    
    for(let image of images){
       image.isVerified = true;
    }
    
    await product.save();
    res.status(200)
    .json({
        success:true,
        message:"Product approved "
    });
 });

 /**
  * Controller function to delete sellers
  */
  const getAllSellers = catchAsyncError(async(req,res,next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const pipeline = [
        {
            $skip:skip
        },
        {
            $limit:limit
        }
    ]

    const sellers = await Seller.aggregate(pipeline);
    res.status(200)
    .json({
        success:true,
        sellers
    });
  });

  /**
   * get single seller
   */
  const getSeller = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const seller = await Seller.findById(id);
    if(!seller){
        return next(new ErrorHandler("Not found",404));
    }
    res.status(200).json({
        success:true,
        seller
    });
  });

  /**
   *  Controller function to Approve seller 
   */
  const approveSeller = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    let seller = await Seller.findById(id);
    if(!seller){
        return next(new ErrorHandler("Not found",404));
    }
    seller.isApproved = true;
    await seller.save();
    res.status(200)
    .json({
        success:true,
        message:"Seller approved"
    })
  });

  /**
   * controller function to delete seller.
   */
  const deleteSeller = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request ",400));
    }
    const seller = await Seller.findById(id);
    if(!seller){
        return next(new ErrorHandler("Not found ",404));
    }

     const products = await Product.find({ seller: id });

     for (const product of products) {
         await product.deleteOne();
     }
     
    await seller.deleteOne();
    res.status(200)
    .json({
        success:true,
        message:"Seller deleted"
    });
  });



 export {
    register,
    login,
    logout,
    myProfile,
    getUnverifiedProducts,
    getUnverifiedProduct,
    approveProduct,
    getAllSellers,
    getSeller,
    approveSeller,
    deleteSeller,
 }